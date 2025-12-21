import { calculateReadingTime } from '../firebase/posts';

describe('Firebase Posts Utilities', () => {
  describe('calculateReadingTime', () => {
    it('should calculate reading time for short content', () => {
      const content = 'This is a short post with about twenty words to test the reading time calculation function accurately.';
      const readingTime = calculateReadingTime(content);
      expect(readingTime).toBe(1);
    });

    it('should calculate reading time for longer content', () => {
      const content = Array(500).fill('word').join(' ');
      const readingTime = calculateReadingTime(content);
      expect(readingTime).toBe(3);
    });

    it('should handle empty content', () => {
      const content = '';
      const readingTime = calculateReadingTime(content);
      expect(readingTime).toBe(1);
    });

    it('should handle content with multiple spaces', () => {
      const content = 'word    word    word';
      const readingTime = calculateReadingTime(content);
      expect(readingTime).toBe(1);
    });
  });
});
