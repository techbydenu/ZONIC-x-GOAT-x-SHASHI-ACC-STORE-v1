// Hide Loader when page loads
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }, 800);
    }
});

// Mobile Navbar Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu on clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
});

// Google Sheet API Link
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxEMdnY6o1ul8mrWPnbcqDmCDiLYRaB18hQpDtXwGiJkrP7uJLG28AhOyYX9qE4VmdEsw/exec";

// Check Payment Status
function checkPayment() {
    const searchVal = document.getElementById('searchInput') ? document.getElementById('searchInput').value.trim() : "";
    if(!searchVal) {
        alert("කරුණාකර Phone Number එකක් ඇතුළත් කරන්න!");
        return;
    }

    fetch(SCRIPT_URL + "?phone=" + searchVal)
    .then(res => res.json())
    .then(data => {
        if(data.status === "success") {
            if(document.getElementById('resName')) document.getElementById('resName').innerText = data.name;
            if(document.getElementById('resAcc')) document.getElementById('resAcc').innerText = data.accId;
            if(document.getElementById('resTotal')) document.getElementById('resTotal').innerText = "LKR " + data.total;
            if(document.getElementById('resPaid')) document.getElementById('resPaid').innerText = "LKR " + data.paid;
            if(document.getElementById('resDue')) document.getElementById('resDue').innerText = "LKR " + data.due;
            if(document.getElementById('resultBox')) document.getElementById('resultBox').style.display = "block";
        } else {
            alert("විස්තර හමු වූයේ නැත! කරුණාකර Phone Number එක පරීක්ෂා කරන්න.");
        }
    })
    .catch(err => alert("Data load කිරීමේ දෝෂයක් සිදු විය!"));
}

// Load Reviews on Page Startup
document.addEventListener("DOMContentLoaded", fetchReviews);

function fetchReviews() {
    fetch(SCRIPT_URL + "?action=getReviews")
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('reviewsContainer');
        if (!container) return;
        container.innerHTML = "";
        
        if (!data || data.length === 0) {
            container.innerHTML = "<p style='text-align:center; color:#94a3b8;'>No reviews yet.</p>";
            return;
        }

        data.reverse().forEach(rev => {
            let stars = "⭐".repeat(rev.rating || 5);
            let imgHtml = rev.imageUrl ? `<img src="${rev.imageUrl}" style="max-width:100%; max-height:250px; border-radius:8px; margin-top:10px; border:1px solid #334155;" alt="Screenshot">` : '';
            
            container.innerHTML += `
                <div style="background: #0f172a; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #f59e0b;">
                    <div style="display: flex; justify-content: space-between;">
                        <strong style="color: #f59e0b;">${rev.name}</strong>
                        <span style="font-size: 12px; color: #94a3b8;">${rev.date || ''}</span>
                    </div>
                    <div style="margin: 5px 0;">${stars}</div>
                    <p style="margin: 5px 0; font-size: 14px; color: #cbd5e1;">${rev.comment}</p>
                    ${imgHtml}
                </div>
            `;
        });
    })
    .catch(() => {
        const container = document.getElementById('reviewsContainer');
        if (container) container.innerHTML = "<p style='text-align:center; color:#ef4444;'>Error loading reviews.</p>";
    });
}

function submitReview() {
    const nameInput = document.getElementById('revName');
    const ratingInput = document.getElementById('revRating');
    const commentInput = document.getElementById('revComment');
    const fileInput = document.getElementById('revImage');
    const subBtn = document.getElementById('subBtn');

    if (!nameInput || !commentInput) return;

    const name = nameInput.value.trim();
    const rating = ratingInput ? ratingInput.value : 5;
    const comment = commentInput.value.trim();

    if (!name || !comment) {
        alert("කරුණාකර නම සහ Comment එක ඇතුළත් කරන්න!");
        return;
    }

    if (subBtn) {
        subBtn.innerText = "Uploading...";
        subBtn.disabled = true;
    }

    if (fileInput && fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            sendData(name, rating, comment, e.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        sendData(name, rating, comment, "");
    }
}

function sendData(name, rating, comment, imageBase64) {
    const subBtn = document.getElementById('subBtn');
    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating, comment, image: imageBase64 })
    })
    .then(() => {
        alert("ඔබගේ Review එක සාර්ථකව එකතු විය! 🌟");
        if(document.getElementById('revName')) document.getElementById('revName').value = "";
        if(document.getElementById('revComment')) document.getElementById('revComment').value = "";
        if(document.getElementById('revImage')) document.getElementById('revImage').value = "";
        if(subBtn) {
            subBtn.innerText = "Submit Review";
            subBtn.disabled = false;
        }
        setTimeout(fetchReviews, 2000);
    })
    .catch(() => {
        alert("Error submitting review!");
        if(subBtn) {
            subBtn.innerText = "Submit Review";
            subBtn.disabled = false;
        }
    });
}
