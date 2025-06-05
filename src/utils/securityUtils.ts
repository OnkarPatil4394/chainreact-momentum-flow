
import { validateCSP, isSecureContext } from './security';

// Security monitoring and validation utilities
export class SecurityMonitor {
  private static instance: SecurityMonitor;
  
  public static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }

  // Initialize security checks
  public initialize(): void {
    this.checkSecureContext();
    this.checkCSP();
    this.setupSecurityEventListeners();
  }

  // Check if running in secure context
  private checkSecureContext(): void {
    if (!isSecureContext()) {
      console.warn('Application is not running in a secure context');
    }
  }

  // Validate Content Security Policy
  private checkCSP(): void {
    if (!validateCSP()) {
      console.warn('Content Security Policy not detected');
    }
  }

  // Setup security event listeners
  private setupSecurityEventListeners(): void {
    // Listen for security policy violations
    document.addEventListener('securitypolicyviolation', (event) => {
      console.error('CSP Violation:', {
        directive: event.violatedDirective,
        blockedURI: event.blockedURI,
        source: event.sourceFile,
        line: event.lineNumber
      });
    });

    // Monitor for potential XSS attempts
    window.addEventListener('error', (event) => {
      if (event.message.includes('script') || event.message.includes('eval')) {
        console.warn('Potential script execution attempt blocked');
      }
    });
  }

  // Validate user input for security threats
  public validateUserInput(input: string): { isValid: boolean; threats: string[] } {
    const threats: string[] = [];
    
    // Check for common XSS patterns
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript\s*:/gi,
      /on\w+\s*=/gi,
      /data:text\/html/gi,
      /vbscript\s*:/gi
    ];
    
    xssPatterns.forEach((pattern, index) => {
      if (pattern.test(input)) {
        threats.push(`XSS pattern ${index + 1} detected`);
      }
    });
    
    // Check for SQL injection patterns (even though we don't use SQL)
    const sqlPatterns = [
      /('|(\\')|(;)|(\\;))/gi,
      /((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/gi,
      /(\%27)|(\')(\%20)*((\%6F)|o|(\%4F))(\%20)*((\%72)|r|(\%52))/gi
    ];
    
    sqlPatterns.forEach((pattern, index) => {
      if (pattern.test(input)) {
        threats.push(`SQL injection pattern ${index + 1} detected`);
      }
    });
    
    return {
      isValid: threats.length === 0,
      threats
    };
  }

  // Generate security report
  public generateSecurityReport(): object {
    return {
      timestamp: new Date().toISOString(),
      secureContext: isSecureContext(),
      cspEnabled: validateCSP(),
      userAgent: navigator.userAgent,
      protocol: window.location.protocol,
      origin: window.location.origin
    };
  }
}

export const securityMonitor = SecurityMonitor.getInstance();
