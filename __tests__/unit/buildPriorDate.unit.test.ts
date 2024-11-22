import { buildPriorDate } from "../../src/utils/buildPriorDate";

describe('buildPriorDate', () => {
    it('should return the date 30 days prior to today in YYYY-MM-DD format', () => {
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
      const expectedYear = thirtyDaysAgo.getFullYear();
      const expectedMonth = String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0');
      const expectedDay = String(thirtyDaysAgo.getDate()).padStart(2, '0');
  
      const expectedDateString = `${expectedYear}-${expectedMonth}-${expectedDay}`;
  
      expect(buildPriorDate()).toBe(expectedDateString);
    });
  });