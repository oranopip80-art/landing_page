// Android App Links Configuration
// This file defines the relationship between your website and Android app

const androidAppLinks = {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
        namespace: "android_app",
        package_name: "com.medsmrtlan.penthu",
        sha256_cert_fingerprints: [
            "9E:4E:B7:AF:38:96:39:7A:F1:7E:32:DC:9C:00:3B:43:D3:26:42:88"
        ]
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = androidAppLinks;
}

// Make available globally
window.androidAppLinks = androidAppLinks;
