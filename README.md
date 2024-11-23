#  Basic Maintenance Tracking System 
1. Setup Instructions
   - Need npm installed on local machine
   - Clone the repository, run npm install
   - How to run the application: npm run dev
   - How to run tests: npx playwright test

2. Features Implementation
   - List of completed features:
      - Equipment and Maintenance Interfaces
      - Forms with zod Validation
      - Equipment and Maintenance Tables
      - Simple Dashboard
      - All Eight Tests

3. Testing Approach
   - The tests look for missing elements and errors.
   - The tests ensure that the pages are displaying success and error messages
   - This is done to always ensure a smooth user experience
   - Tests are ran via the command - npx playwright test

4. Technical Decisions
   - Key libraries include tanstacks react tables, recharts, uuid, zod.
   - Tanstack tables offer minimal usage with large datasets.
   - Recharts offer simple and responsive graph design.
   - uuid is used to generate simple ids.
   - zod allows the datasets to remain within their requirements.
   - Architecturaly, this project is a simple three page project.
   - The three page approach provides minimal page files while still keeping reusable components viable.
   - We handle all of the data through two apis and two json files.
   - This approach provides an easy debugging process, as well as a great potential for exporting the data at one's leisure.

5. Known Issues/Limitations
   - Tables have not been tested with large datasets.
   - The tables do not have filter by amount, i.e., 10 per page.
   - The ui is not very responsive to different screen sizes
   - Future improvements would include
      - Better ui responsiveness
      - Better table size management

6. Bonus Features (if implemented)
   - N/A