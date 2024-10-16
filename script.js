document.addEventListener('DOMContentLoaded', () => {
    const claimForm = document.getElementById('claim-form');
    const trackClaims = document.getElementById('track-claims');
    const chatbot = document.getElementById('chatbot');
    const knowledgeBase = document.getElementById('knowledge-base');
    const successMessage = document.getElementById('success-message');
    const claimsList = document.getElementById('claims-list');
    const searchBar = document.getElementById('search-bar');
    const searchResults = document.getElementById('search-results');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const landingSection = document.getElementById('landing-section');

    // Menu Buttons (Desktop and Mobile)
    const menuButtons = document.querySelectorAll('.menu-btn, .mobile-menu-btn');

    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.getAttribute('data-section');
            toggleSection(section);
            // If mobile menu is open, close it after selection
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Mobile Menu Toggle
    mobileMenuButton.addEventListener('click', () => {
        const isExpanded = mobileMenu.classList.toggle('hidden');
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
    });

    // Claim Submission Logic
    const submitClaimBtn = document.getElementById('submit-claim-btn');
    submitClaimBtn.addEventListener('click', () => {
        const policyNumber = document.getElementById('policy-number').value.trim();
        const incidentDate = document.getElementById('incident-date').value;
        const incidentDescription = document.getElementById('incident-description').value.trim();
        const fileUpload = document.getElementById('file-upload').files[0];

        // Basic Validation
        if (!policyNumber || !incidentDate || !incidentDescription) {
            alert('Please fill in all required fields.');
            return;
        }

        // Generate a unique claim number (e.g., CLM followed by timestamp)
        const claimNumber = `CLM${Date.now()}`;

        // Create a new claim object
        const newClaim = {
            number: claimNumber,
            status: 'Submitted',
            date: incidentDate,
            description: incidentDescription,
            file: fileUpload ? fileUpload.name : 'No file attached'
        };

        // Save to localStorage
        let claims = JSON.parse(localStorage.getItem('claims')) || [];
        claims.push(newClaim);
        localStorage.setItem('claims', JSON.stringify(claims));

        // Show success message
        successMessage.classList.remove('hidden');
        setTimeout(() => successMessage.classList.add('hidden'), 8000);

        // Clear the form
        clearForm();

        // If the track claims section is visible, update the list
        if (!trackClaims.classList.contains('hidden')) {
            loadClaims();
        }
    });

    function toggleSection(sectionId) {

        [landingSection, claimForm, trackClaims, chatbot, knowledgeBase].forEach(sec => sec.classList.add('hidden'));

        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.remove('hidden');

            if (sectionId === 'track-claims') {
                loadClaims();
            }
        }
    }

    function loadClaims() {
        claimsList.innerHTML = '';  
        const claims = JSON.parse(localStorage.getItem('claims')) || [];

        if (claims.length === 0) {
            claimsList.innerHTML = `
                <tr>
                    <td colspan="3" class="py-2 px-6 border-b text-center">No claims submitted yet.</td>
                </tr>
            `;
            return;
        }

        claims.forEach(claim => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2 px-40 border-b">${claim.number}</td>
                <td class="py-2 px-40 border-b">${claim.status}</td>
                <td class="py-2 px-40 border-b">${formatDate(claim.date)}</td>
            `;
            claimsList.appendChild(row);
        });
    }

    function clearForm() {
        document.getElementById('policy-number').value = '';
        document.getElementById('incident-date').value = '';
        document.getElementById('incident-description').value = '';
        document.getElementById('file-upload').value = '';
    }

    function formatDate(dateStr) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    }

    // Knowledge Base Search Logic
    const faqs = [
        {
            question: "How do I file a claim?",
            answer: "To file a claim, navigate to the 'File a Claim' section, fill out the required details, and submit the form."
        },
        {
            question: "What information is required to submit a claim?",
            answer: "You'll need your policy number, incident date, a description of the incident, and any supporting documents."
        },
        {
            question: "How can I track my claim status?",
            answer: "Go to the 'Track Claims' section to view the status of your submitted claims."
        },
        {
            question: "What should I do if my claim is denied?",
            answer: "If your claim is denied, you can contact our support team for further assistance or file an appeal."
        },
        {
            question: "How do I update my personal information?",
            answer: "You can update your personal information by logging into your account and navigating to the 'Profile' section."
        },
        // Add more FAQs as needed
    ];

    searchBar.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const results = faqs.filter(faq => 
            faq.question.toLowerCase().includes(query) || 
            faq.answer.toLowerCase().includes(query)
        );
        displaySearchResults(results);
    });

    function displaySearchResults(results) {
        searchResults.innerHTML = '';

        if (results.length === 0) {
            searchResults.innerHTML = '<p class="text-gray-600">No results found.</p>';
            return;
        }

        results.forEach(faq => {
            const card = document.createElement('div');
            card.className = 'bg-white p-4 rounded shadow';
            card.innerHTML = `
                <h3 class="font-semibold text-lg mb-2">${faq.question}</h3>
                <p class="text-gray-700">${faq.answer}</p>
            `;
            searchResults.appendChild(card);
        });
    }

    
});
