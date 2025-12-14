// iOS Universal Links Configuration
// This file defines the relationship between your website and iOS app

const iosAppLinks = [
    {
        applinks: {
            apps: [],
            details: [
                {
                    appID: "YOUR_TEAM_ID.com.penthu.app",
                    paths: ["*"]
                }
            ]
        }
    }
];

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = iosAppLinks;
}

// Make available globally
window.iosAppLinks = iosAppLinks;
