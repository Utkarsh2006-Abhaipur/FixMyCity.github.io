import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const totalIssues =
    document.getElementById("totalIssues");

const inProgressIssues =
    document.getElementById("inProgressIssues");

const resolvedIssues =
    document.getElementById("resolvedIssues");

const resolutionRate =
    document.getElementById("resolutionRate");


async function loadCityImpact() {

    try {

        const querySnapshot =
            await getDocs(
                collection(db, "issues")
            );


        const issues = [];


        querySnapshot.forEach(document => {

            issues.push(
                document.data()
            );

        });


        const total =
            issues.length;


        const inProgress =
            issues.filter(
                issue =>
                    issue.status ===
                    "In Progress"
            ).length;


        const resolved =
            issues.filter(
                issue =>
                    issue.status ===
                    "Resolved"
            ).length;


        const rate =
            total === 0
                ? 0
                : Math.round(
                    (resolved / total) * 100
                );


        if (totalIssues) {

            totalIssues.textContent =
                total;

        }


        if (inProgressIssues) {

            inProgressIssues.textContent =
                inProgress;

        }


        if (resolvedIssues) {

            resolvedIssues.textContent =
                resolved;

        }


        if (resolutionRate) {

            resolutionRate.textContent =
                `${rate}%`;

        }

    } catch (error) {

        console.error(
            "Error loading city impact:",
            error
        );

    }

}


loadCityImpact();