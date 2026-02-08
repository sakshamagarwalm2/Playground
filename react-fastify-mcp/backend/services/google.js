const { google } = require('googleapis');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Scopes for Gmail and Calendar
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/calendar'
];

let userTokens = null; // In-memory token storage (MVP)

// Generate Auth URL
const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
};

// Set Credentials from Code
const setCredentials = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  userTokens = tokens;
  return tokens;
};

// Check if authenticated
const isAuthenticated = () => !!userTokens;

// Fetch last 5 emails
const getRecentEmails = async () => {
  if (!isAuthenticated()) throw new Error('Not authenticated');
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 5,
  });
  
  if (!response.data.messages) return [];

  const emails = [];
  for (const msg of response.data.messages) {
    const details = await gmail.users.messages.get({ userId: 'me', id: msg.id });
    const headers = details.data.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value;
    const from = headers.find(h => h.name === 'From')?.value;
    emails.push({ id: msg.id, subject, from, snippet: details.data.snippet });
  }
  return emails;
};

// Fetch calendar events for current month only
const getUpcomingEvents = async () => {
  if (!isAuthenticated()) throw new Error('Not authenticated');
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  // Get current date and end of month
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  
  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: endOfMonth.toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response.data.items;
  } catch (error) {
    if (error.message.includes('Google Calendar API has not been used')) {
      throw new Error('Google Calendar API is NOT enabled. Please enable it in Google Cloud Console.');
    }
    throw error;
  }
};


// Send an email
const sendEmail = async ({ to, subject, body }) => {
  if (!isAuthenticated()) throw new Error('Not authenticated');
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    `From: <me>`,
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=utf-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    body,
  ];
  const message = messageParts.join('\n');
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });
  return res.data;
};

// List emails with query
const listEmails = async (query = '', maxResults = 10) => {
  if (!isAuthenticated()) throw new Error('Not authenticated');
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  
  const response = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults: maxResults,
  });
  
  if (!response.data.messages) return [];

  const emails = [];
  // Batch get details (in parallel for speed)
  const promises = response.data.messages.map(msg => 
    gmail.users.messages.get({ userId: 'me', id: msg.id })
  );
  
  const results = await Promise.all(promises);
  
  for (const details of results) {
    const headers = details.data.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value;
    const from = headers.find(h => h.name === 'From')?.value;
    emails.push({ id: details.data.id, subject, from, snippet: details.data.snippet });
  }
  return emails;
};

// List calendar events
const listEvents = async (timeMin, timeMax, maxResults = 10) => {
  if (!isAuthenticated()) throw new Error('Not authenticated');
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: timeMin || new Date().toISOString(),
    timeMax: timeMax,
    maxResults: maxResults,
    singleEvents: true,
    orderBy: 'startTime',
  });
  return response.data.items;
};

// Create calendar event
const createEvent = async ({ summary, description, startTime, endTime }) => {
  if (!isAuthenticated()) throw new Error('Not authenticated');
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  const event = {
    summary,
    description,
    start: {
      dateTime: startTime, // ISO string
      timeZone: 'UTC', // Or user's timezone if known
    },
    end: {
      dateTime: endTime, // ISO string
      timeZone: 'UTC',
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
  });
  return response.data;
};

module.exports = {
  getAuthUrl,
  setCredentials,
  isAuthenticated,
  getRecentEmails, // Keeping for backward compatibility
  getUpcomingEvents, // Keeping for backward compatibility
  sendEmail,
  listEmails,
  listEvents,
  createEvent
};
