import { test, expect } from '@playwright/test';

const MOCK_API_URL = 'http://localhost:8000';
const MOCK_USER = {
  id: 'cl-user-1',
  email: 'test@example.com',
  access_token: 'fake-token',
};

const MOCK_NOTES = [
  { id: 'note-1', title: 'First Note', content: 'This is the first mock note.', created_at: new Date().toISOString(), status: 'active' },
  { id: 'note-2', title: 'Second Note', content: 'This is the second mock note.', created_at: new Date().toISOString(), status: 'active' },
];

test.describe('Notes App E2E Flow', () => {
  let newNoteCreated = false;
  let newNote = {};

  test.beforeEach(async ({ page }) => {
    // Mock API calls
    await page.route(`${MOCK_API_URL}/**`, async route => {
      const request = route.request();
      const url = request.url();
      const method = request.method();

      if (url.includes('/auth/login') && method === 'POST') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_USER),
        });
      }
      
      if (url.includes('/notes') && method === 'GET') {
         // Respond with all notes, or just the new one after it's created
        const body = newNoteCreated ? [...MOCK_NOTES, newNote] : MOCK_NOTES;
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(body),
        });
      }

      if (url.includes('/notes') && method === 'POST') {
        const postData = JSON.parse(request.postData());
        newNote = {
            id: 'note-3',
            title: postData.title,
            content: postData.content,
            created_at: new Date().toISOString(),
            status: 'active'
        };
        newNoteCreated = true;
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(newNote),
        });
      }

      // Fallback for any other request
      return route.continue();
    });

    newNoteCreated = false;
    newNote = {};
  });

  test('should allow a user to log in, create a note, and log out', async ({ page }) => {
    // 1. Visit the app and log in
    await page.goto('http://localhost:5173/');
    
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
    
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // 2. Verify dashboard is shown with initial notes
    await page.waitForURL('**/dashboard');
    await expect(page.getByText(/My Notes/)).toBeVisible();
    await expect(page.getByText('test@example.com')).toBeVisible();
    
    // Check for initial notes
    await expect(page.getByText('First Note')).toBeVisible();
    await expect(page.getByText('Second Note')).toBeVisible();

    // 3. Create a new note
    await page.getByLabel('Create new note').click();
    
    // Modal appears
    await expect(page.getByRole('heading', { name: 'Create New Note' })).toBeVisible();
    
    // Fill out the form
    const newNoteTitle = 'My New E2E Note';
    await page.getByLabel('Title').fill(newNoteTitle);
    await page.getByLabel('Content').fill('This note was created during an E2E test.');
    
    await page.getByRole('button', { name: 'Create Note' }).click();

    // 4. Verify the new note is on the dashboard
    // Modal should disappear
    await expect(page.getByRole('heading', { name: 'Create New Note' })).not.toBeVisible();
    
    // The new note should now be visible on the dashboard
    await expect(page.getByText(newNoteTitle)).toBeVisible();
    
    // 5. Log out
    await page.getByRole('button', { name: 'Sign Out' }).click();
    
    // 6. Verify user is back on the login page
    await page.waitForURL('**/');
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  });
});
