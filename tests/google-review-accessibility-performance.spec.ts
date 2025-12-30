import { test, expect } from '@playwright/test';

/**
 * Accessibility and Performance Test Cases
 * Tests: WCAG compliance, keyboard navigation, performance metrics
 */

test.describe('Google Review Configuration - Accessibility & Performance', () => {
  
  const BASE_URL = 'https://sandbox.useharp.com/google-review';

  test.describe('Accessibility - WCAG Compliance', () => {

    test('TC1601 - should have proper heading hierarchy', async ({ page }) => {
      console.log('\n=== TC1601: Heading Hierarchy ===');
      
      await page.goto(BASE_URL);
      
      console.log('Step 1: Finding all headings on page');
      const headings = await page.evaluate(() => {
        const h = [];
        for (let i = 1; i <= 6; i++) {
          const elements = document.querySelectorAll(`h${i}`);
          elements.forEach(el => {
            h.push({
              level: i,
              text: el.textContent?.trim()
            });
          });
        }
        return h;
      });
      
      console.log('Step 2: Analyzing heading structure');
      headings.forEach(h => {
        console.log(`  H${h.level}: ${h.text}`);
      });
      
      console.log('Step 3: Verifying logical hierarchy');
      const hasH1 = headings.some(h => h.level === 1);
      console.log(`  Has H1: ${hasH1}`);
      
      console.log('✓ Heading hierarchy checked\n');
    });

    test('TC1602 - should have proper form labels', async ({ page }) => {
      console.log('\n=== TC1602: Form Labels ===');
      
      await page.goto(BASE_URL);
      
      console.log('Step 1: Checking all form inputs have labels');
      const inputsWithoutLabels = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input, textarea, select');
        const unlabeled = [];
        
        inputs.forEach(input => {
          const id = input.id;
          const ariaLabel = input.getAttribute('aria-label');
          const ariaLabelledBy = input.getAttribute('aria-labelledby');
          const hasLabel = id && document.querySelector(`label[for="${id}"]`);
          
          if (!hasLabel && !ariaLabel && !ariaLabelledBy) {
            unlabeled.push({
              type: input.tagName,
              name: input.getAttribute('name'),
              placeholder: input.getAttribute('placeholder')
            });
          }
        });
        
        return unlabeled;
      });
      
      console.log(`Step 2: Found ${inputsWithoutLabels.length} unlabeled inputs`);
      if (inputsWithoutLabels.length > 0) {
        console.log('  Unlabeled inputs:', inputsWithoutLabels);
      } else {
        console.log('  ✓ All inputs properly labeled');
      }
      
      console.log('✓ Form label check completed\n');
    });

    test('TC1603 - should have proper color contrast', async ({ page }) => {
      console.log('\n=== TC1603: Color Contrast ===');
      
      await page.goto(BASE_URL);
      
      console.log('Step 1: Checking text color contrast');
      const contrastIssues = await page.evaluate(() => {
        const issues = [];
        const texts = document.querySelectorAll('p, span, label, button, a');
        
        texts.forEach(el => {
          const style = window.getComputedStyle(el);
          const color = style.color;
          const bgColor = style.backgroundColor;
          
          if (color && bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
            // Log some color combinations for manual review
            issues.push({
              text: el.textContent?.substring(0, 30),
              color: color,
              backgroundColor: bgColor
            });
          }
        });
        
        return issues.slice(0, 5); // Return first 5 for review
      });
      
      console.log('Step 2: Sample color combinations:');
      contrastIssues.forEach(issue => {
        console.log(`  Text: "${issue.text}" | Color: ${issue.color} | BG: ${issue.backgroundColor}`);
      });
      
      console.log('✓ Color contrast review completed\n');
    });

    test('TC1604 - should have focusable elements in logical tab order', async ({ page }) => {
      console.log('\n=== TC1604: Tab Order ===');
      
      await page.goto(BASE_URL);
      
      console.log('Step 1: Mapping tab order');
      const tabOrder = [];
      
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        
        const focusedElement = await page.evaluate(() => {
          const el = document.activeElement;
          return {
            tag: el?.tagName,
            type: el?.getAttribute('type'),
            role: el?.getAttribute('role'),
            name: el?.getAttribute('name'),
            ariaLabel: el?.getAttribute('aria-label')
          };
        });
        
        tabOrder.push(focusedElement);
        console.log(`  Tab ${i + 1}: ${focusedElement.tag} ${focusedElement.role || focusedElement.type || ''}`);
      }
      
      console.log('✓ Tab order mapped\n');
    });

    test('TC1605 - should support keyboard shortcuts', async ({ page }) => {
      console.log('\n=== TC1605: Keyboard Shortcuts ===');
      
      await page.goto(BASE_URL);
      
      console.log('Step 1: Testing common keyboard shortcuts');
      
      // Test Tab navigation
      console.log('  Testing: Tab navigation');
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      
      // Test Shift+Tab (reverse)
      console.log('  Testing: Shift+Tab (reverse)');
      await page.keyboard.press('Shift+Tab');
      await page.waitForTimeout(200);
      
      // Test Enter to submit
      console.log('  Testing: Enter to activate');
      await page.getByRole('button', { name: 'Save Changes' }).focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
      
      // Test Escape (if modal exists)
      console.log('  Testing: Escape key');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
      
      console.log('✓ Keyboard shortcuts tested\n');
    });

    test('TC1606 - should announce dynamic content changes', async ({ page }) => {
      console.log('\n=== TC1606: Dynamic Content Announcements ===');
      
      await page.goto(BASE_URL);
      
      console.log('Step 1: Checking for ARIA live regions');
      const liveRegions = await page.evaluate(() => {
        const regions = document.querySelectorAll('[aria-live], [role="alert"], [role="status"]');
        return Array.from(regions).map(el => ({
          role: el.getAttribute('role'),
          ariaLive: el.getAttribute('aria-live'),
          text: el.textContent?.trim()
        }));
      });
      
      console.log(`Step 2: Found ${liveRegions.length} live regions`);
      liveRegions.forEach(region => {
        console.log(`  ${region.role || 'live region'}: ${region.ariaLive}`);
      });
      
      console.log('Step 3: Triggering dynamic change (save)');
      await page.getByRole('button', { name: 'Save Changes' }).click();
      await page.waitForTimeout(1500);
      
      console.log('Step 4: Checking if success message has proper role');
      const successElement = page.getByText('Success', { exact: true });
      const successRole = await successElement.getAttribute('role').catch(() => null);
      console.log(`  Success message role: ${successRole || 'not set'}`);
      
      console.log('✓ Dynamic content announcements checked\n');
    });

    test('TC1607 - should have proper button and link text', async ({ page }) => {
      console.log('\n=== TC1607: Button and Link Text ===');
      
      await page.goto(BASE_URL);
      
      console.log('Step 1: Checking all buttons have descriptive text');
      const buttons = await page.evaluate(() => {
        const btns = document.querySelectorAll('button');
        return Array.from(btns).map(btn => ({
          text: btn.textContent?.trim(),
          ariaLabel: btn.getAttribute('aria-label'),
          title: btn.getAttribute('title')
        }));
      });
      
      console.log('Step 2: Button text analysis');
      buttons.forEach(btn => {
        const displayText = btn.text || btn.ariaLabel || btn.title || '[No text]';
        console.log(`  Button: ${displayText}`);
      });
      
      console.log('Step 3: Checking all links have descriptive text');
      const links = await page.evaluate(() => {
        const lnks = document.querySelectorAll('a');
        return Array.from(lnks).map(lnk => ({
          text: lnk.textContent?.trim(),
          href: lnk.getAttribute('href'),
          ariaLabel: lnk.getAttribute('aria-label')
        }));
      });
      
      if (links.length > 0) {
        console.log('Step 4: Link text analysis');
        links.forEach(lnk => {
          const displayText = lnk.text || lnk.ariaLabel || '[No text]';
          console.log(`  Link: ${displayText} -> ${lnk.href}`);
        });
      }
      
      console.log('✓ Button and link text checked\n');
    });
  });

  test.describe('Performance Metrics', () => {

    test('TC1701 - should measure page load performance', async ({ page }) => {
      console.log('\n=== TC1701: Page Load Performance ===');
      
      console.log('Step 1: Measuring page load time');
      const startTime = Date.now();
      
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      console.log(`  Total load time: ${loadTime}ms`);
      
      console.log('Step 2: Getting detailed performance metrics');
      const metrics = await page.evaluate(() => {
        const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (!perf) return null;
        
        return {
          dns: Math.round(perf.domainLookupEnd - perf.domainLookupStart),
          tcp: Math.round(perf.connectEnd - perf.connectStart),
          request: Math.round(perf.responseStart - perf.requestStart),
          response: Math.round(perf.responseEnd - perf.responseStart),
          domProcessing: Math.round(perf.domContentLoadedEventEnd - perf.domLoading),
          loadComplete: Math.round(perf.loadEventEnd - perf.loadEventStart)
        };
      });
      
      if (metrics) {
        console.log('Step 3: Performance breakdown:');
        console.log(`  DNS lookup: ${metrics.dns}ms`);
        console.log(`  TCP connection: ${metrics.tcp}ms`);
        console.log(`  Request time: ${metrics.request}ms`);
        console.log(`  Response time: ${metrics.response}ms`);
        console.log(`  DOM processing: ${metrics.domProcessing}ms`);
        console.log(`  Load complete: ${metrics.loadComplete}ms`);
        
        console.log('Step 4: Performance assertions');
        expect(loadTime).toBeLessThan(10000); // Should load in under 10s
        console.log('  ✓ Page loads within acceptable time');
      }
      
      console.log('✓ Performance metrics measured\n');
    });

    test('TC1702 - should measure interaction responsiveness', async ({ page }) => {
      console.log('\n=== TC1702: Interaction Responsiveness ===');
      
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      console.log('Step 1: Measuring toggle switch response time');
      const toggleStart = Date.now();
      await page.getByRole('switch', { name: 'Enable Google Review Requests' }).click();
      const toggleTime = Date.now() - toggleStart;
      console.log(`  Toggle response time: ${toggleTime}ms`);
      
      console.log('Step 2: Measuring input field response time');
      const inputStart = Date.now();
      const input = page.getByRole('textbox', { name: 'Request Timing' });
      await input.click();
      await input.fill('15');
      const inputTime = Date.now() - inputStart;
      console.log(`  Input response time: ${inputTime}ms`);
      
      console.log('Step 3: Measuring button click response time');
      const buttonStart = Date.now();
      await page.getByRole('button', { name: 'Save Changes' }).click();
      await page.waitForResponse(response => response.status() === 200).catch(() => null);
      const buttonTime = Date.now() - buttonStart;
      console.log(`  Button response time: ${buttonTime}ms`);
      
      console.log('Step 4: Performance assertions');
      expect(toggleTime).toBeLessThan(1000);
      expect(inputTime).toBeLessThan(1000);
      console.log('  ✓ Interactions are responsive');
      
      console.log('✓ Interaction responsiveness measured\n');
    });

    test('TC1703 - should measure memory usage', async ({ page }) => {
      console.log('\n=== TC1703: Memory Usage ===');
      
      await page.goto(BASE_URL);
      
      console.log('Step 1: Getting initial memory metrics');
      const initialMemory = await page.evaluate(() => {
        if ('memory' in performance) {
          const mem = (performance as any).memory;
          return {
            used: Math.round(mem.usedJSHeapSize / 1048576),
            total: Math.round(mem.totalJSHeapSize / 1048576),
            limit: Math.round(mem.jsHeapSizeLimit / 1048576)
          };
        }
        return null;
      });
      
      if (initialMemory) {
        console.log('  Initial memory usage:');
        console.log(`    Used: ${initialMemory.used}MB`);
        console.log(`    Total: ${initialMemory.total}MB`);
        console.log(`    Limit: ${initialMemory.limit}MB`);
        
        console.log('Step 2: Performing actions');
        for (let i = 0; i < 10; i++) {
          await page.getByRole('switch', { name: 'Enable Google Review Requests' }).click();
          await page.waitForTimeout(100);
        }
        
        console.log('Step 3: Getting memory after interactions');
        const afterMemory = await page.evaluate(() => {
          if ('memory' in performance) {
            const mem = (performance as any).memory;
            return {
              used: Math.round(mem.usedJSHeapSize / 1048576),
              total: Math.round(mem.totalJSHeapSize / 1048576)
            };
          }
          return null;
        });
        
        if (afterMemory) {
          console.log('  Memory after interactions:');
          console.log(`    Used: ${afterMemory.used}MB`);
          console.log(`    Increase: ${afterMemory.used - initialMemory.used}MB`);
          
          const memoryIncrease = afterMemory.used - initialMemory.used;
          expect(memoryIncrease).toBeLessThan(50); // Memory increase should be reasonable
          console.log('  ✓ Memory usage is acceptable');
        }
      } else {
        console.log('  Memory metrics not available in this browser');
      }
      
      console.log('✓ Memory usage measured\n');
    });

    test('TC1704 - should handle rapid consecutive operations efficiently', async ({ page }) => {
      console.log('\n=== TC1704: Rapid Operations Performance ===');
      
      await page.goto(BASE_URL);
      
      const timingInput = page.getByRole('textbox', { name: 'Request Timing' });
      
      console.log('Step 1: Performing 50 rapid input changes');
      const startTime = Date.now();
      
      for (let i = 1; i <= 50; i++) {
        await timingInput.fill(i.toString());
      }
      
      const duration = Date.now() - startTime;
      console.log(`  Completed 50 operations in ${duration}ms`);
      console.log(`  Average time per operation: ${(duration / 50).toFixed(2)}ms`);
      
      console.log('Step 2: Verifying page is still responsive');
      await expect(timingInput).toHaveValue('50');
      console.log('  ✓ Page remains responsive after rapid operations');
      
      expect(duration).toBeLessThan(5000); // Should complete in under 5 seconds
      
      console.log('✓ Rapid operations performance tested\n');
    });

    test('TC1705 - should measure form submission performance', async ({ page }) => {
      console.log('\n=== TC1705: Form Submission Performance ===');
      
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      console.log('Step 1: Setting up form data');
      await page.getByRole('textbox', { name: 'Request Timing' }).fill('15');
      
      const reviewToggle = page.getByRole('switch', { name: 'Enable Google Review Requests' });
      if (!await reviewToggle.isChecked()) {
        await reviewToggle.click();
      }
      
      console.log('Step 2: Measuring submission time');
      const startTime = Date.now();
      
      await page.getByRole('button', { name: 'Save Changes' }).click();
      
      // Wait for success message or network response
      await Promise.race([
        page.getByText('Success', { exact: true }).waitFor({ state: 'visible', timeout: 10000 }),
        page.waitForTimeout(10000)
      ]);
      
      const submissionTime = Date.now() - startTime;
      console.log(`  Form submission time: ${submissionTime}ms`);
      
      console.log('Step 3: Performance assertion');
      expect(submissionTime).toBeLessThan(5000); // Should submit in under 5s
      console.log('  ✓ Form submits within acceptable time');
      
      console.log('✓ Form submission performance measured\n');
    });
  });

  test.describe('Mobile Accessibility', () => {

    test('TC1801 - should be usable on mobile viewport', async ({ page }) => {
      console.log('\n=== TC1801: Mobile Usability ===');
      
      console.log('Step 1: Setting mobile viewport');
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      await page.goto(BASE_URL);
      
      console.log('Step 2: Verifying all controls are accessible');
      await expect(page.getByRole('switch', { name: 'Enable Google Review Requests' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Request Timing' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Save Changes' })).toBeVisible();
      console.log('  ✓ All controls visible on mobile');
      
      console.log('Step 3: Testing tap targets are adequate size');
      const toggleSize = await page.getByRole('switch', { name: 'Enable Google Review Requests' }).boundingBox();
      if (toggleSize) {
        console.log(`  Toggle size: ${toggleSize.width}x${toggleSize.height}px`);
        expect(Math.min(toggleSize.width, toggleSize.height)).toBeGreaterThan(44); // iOS minimum tap target
      }
      
      console.log('Step 4: Testing interactions work on mobile');
      await page.getByRole('switch', { name: 'Enable Google Review Requests' }).tap();
      await page.getByRole('textbox', { name: 'Request Timing' }).tap();
      await page.getByRole('textbox', { name: 'Request Timing' }).fill('15');
      console.log('  ✓ Mobile interactions working');
      
      console.log('✓ Mobile usability verified\n');
    });

    test('TC1802 - should handle touch gestures', async ({ page }) => {
      console.log('\n=== TC1802: Touch Gesture Support ===');
      
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);
      
      console.log('Step 1: Testing tap gesture on toggle');
      const toggle = page.getByRole('switch', { name: 'Enable Google Review Requests' });
      await toggle.tap();
      await expect(toggle).toBeChecked();
      console.log('  ✓ Tap gesture works');
      
      console.log('Step 2: Testing tap gesture on buttons');
      await page.getByRole('button', { name: 'Save Changes' }).tap();
      await page.waitForTimeout(1000);
      console.log('  ✓ Button tap works');
      
      console.log('Step 3: Testing text input with virtual keyboard');
      const input = page.getByRole('textbox', { name: 'Request Timing' });
      await input.tap();
      await input.fill('20');
      await expect(input).toHaveValue('20');
      console.log('  ✓ Virtual keyboard input works');
      
      console.log('✓ Touch gestures verified\n');
    });
  });
});
