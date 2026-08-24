import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const trackingIdInput = document.getElementById("trackingId");
const trackBtn = document.getElementById("trackBtn");
const trackingResult = document.getElementById("trackingResult");


function formatDate(timestamp) {
    if (!timestamp) return "Recently submitted";

    try {
        return timestamp.toDate().toLocaleString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });
    } catch {
        return "Recently submitted";
    }
}


function getStatusIndex(status) {
    const statuses = [
        "Submitted",
        "Under Review",
        "In Progress",
        "Resolved"
    ];

    return statuses.indexOf(status);
}


async function trackIssue() {

    const trackingId = trackingIdInput.value
        .trim()
        .toUpperCase();

    if (!trackingId) {
        alert("Please enter your Tracking ID.");
        return;
    }

    const originalButtonHTML = trackBtn.innerHTML;

    try {

        trackBtn.disabled = true;
        trackBtn.textContent = "Searching...";

        const issuesRef = collection(db, "issues");

        const issueQuery = query(
            issuesRef,
            where("issueId", "==", trackingId)
        );

        const querySnapshot = await getDocs(issueQuery);

        console.log("Documents found:", querySnapshot.size);
        console.log("Searching for:", trackingId);

        if (querySnapshot.empty) {

            trackingResult.innerHTML = `
                <div class="tracking-empty show">
                    <div class="empty-icon">❌</div>

                    <h2>Report Not Found</h2>

                    <p>
                        No report was found with Tracking ID:
                        <strong>${trackingId}</strong>
                    </p>
                </div>
            `;

            return;
        }


        const issueData = querySnapshot.docs[0].data();

        const status = issueData.status || "Submitted";

        const currentStep = getStatusIndex(status);


        trackingResult.innerHTML = `

            <div class="report-result-card show">

                <div class="result-header">

                    <div>
                        <span class="result-label">
                            TRACKING ID
                        </span>

                        <h2>
                            ${issueData.issueId || "--"}
                        </h2>
                    </div>

                    <span class="status-badge">
                        ${status}
                    </span>

                </div>


                ${
                    issueData.imageUrl
                        ? `
                        <img
                            src="${issueData.imageUrl}"
                            alt="Reported issue"
                            class="result-image"
                        >
                        `
                        : ""
                }


                <div class="result-details">

                    <div class="result-item">
                        <span>Category</span>
                        <strong>
                            ${issueData.category || "Not specified"}
                        </strong>
                    </div>


                    <div class="result-item">
                        <span>Description</span>
                        <strong>
                            ${issueData.description || "No description provided"}
                        </strong>
                    </div>


                    <div class="result-item">
                        <span>Location</span>
                        <strong>
                            ${issueData.location || "Location not provided"}
                        </strong>
                    </div>


                    <div class="result-item">
                        <span>Submitted</span>
                        <strong>
                            ${formatDate(issueData.createdAt)}
                        </strong>
                    </div>

                </div>


                <div class="tracking-timeline">

                    <div class="timeline-step ${currentStep >= 0 ? "active" : ""}">
                        <span>1</span>
                        <p>Submitted</p>
                    </div>

                    <div class="timeline-step ${currentStep >= 1 ? "active" : ""}">
                        <span>2</span>
                        <p>Under Review</p>
                    </div>

                    <div class="timeline-step ${currentStep >= 2 ? "active" : ""}">
                        <span>3</span>
                        <p>In Progress</p>
                    </div>

                    <div class="timeline-step ${currentStep >= 3 ? "active" : ""}">
                        <span>4</span>
                        <p>Resolved</p>
                    </div>

                </div>

            </div>
        `;

    } catch (error) {

        console.error("Tracking error:", error);

        trackingResult.innerHTML = `
            <div class="tracking-empty show">

                <div class="empty-icon">⚠️</div>

                <h2>Unable to Retrieve Report</h2>

                <p>
                    ${error.message}
                </p>

            </div>
        `;

    } finally {

        trackBtn.disabled = false;
        trackBtn.innerHTML = originalButtonHTML;

    }
}


trackBtn.addEventListener("click", trackIssue);


trackingIdInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        event.preventDefault();
        trackIssue();
    }

});


trackingIdInput.addEventListener("input", () => {

    trackingIdInput.value =
        trackingIdInput.value.toUpperCase();

});


/* =========================
   AUTO TRACK FROM URL
========================= */

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const trackingIdFromUrl =
    urlParams.get("id");


if (trackingIdFromUrl) {

    trackingIdInput.value =
        trackingIdFromUrl
            .trim()
            .toUpperCase();


    trackIssue();

}