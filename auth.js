import {
    auth,
    googleProvider,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    onAuthStateChanged
} from "./firebase.js";


// ==========================================
// FIND LOGIN BUTTONS
// ==========================================

const citizenLoginBtn =
    document.getElementById("citizenLoginBtn");

const adminLoginBtn =
    document.getElementById("adminLoginBtn");

const logoutBtn =
    document.getElementById("logoutBtn");


// ==========================================
// CITIZEN LOGIN
// ==========================================

if (citizenLoginBtn) {

    citizenLoginBtn.addEventListener(
        "click",
        () => {

            localStorage.setItem(
                "userRole",
                "citizen"
            );

            signInWithRedirect(
                auth,
                googleProvider
            );

        }
    );

}


// ==========================================
// ADMIN LOGIN
// ==========================================

if (adminLoginBtn) {

    adminLoginBtn.addEventListener(
        "click",
        () => {

            localStorage.setItem(
                "userRole",
                "admin"
            );

            signInWithRedirect(
                auth,
                googleProvider
            );

        }
    );

}


// ==========================================
// HANDLE GOOGLE REDIRECT
// ==========================================

getRedirectResult(auth)

    .then((result) => {

        if (!result) return;


        const user = result.user;

        const role =
            localStorage.getItem(
                "userRole"
            );


        console.log(
            "Logged in:",
            user.email
        );


        // Save user information

        localStorage.setItem(
            "currentUserUid",
            user.uid
        );


        localStorage.setItem(
            "currentUserEmail",
            user.email || ""
        );


        // ==================================
        // REDIRECT ACCORDING TO ROLE
        // ==================================

        if (role === "citizen") {

            window.location.href =
                "index.html#report";

        }

        else if (role === "admin") {

            window.location.href =
                "index.html#admin";

        }

    })

    .catch((error) => {

        console.error(
            "Google sign-in failed:",
            error
        );

        alert(
            "Google sign-in failed. Please try again."
        );

    });


// ==========================================
// CHECK LOGIN STATE
// ==========================================

onAuthStateChanged(
    auth,
    (user) => {

        if (user) {

            console.log(
                "User logged in:",
                user.email
            );


            localStorage.setItem(
                "currentUserUid",
                user.uid
            );


            localStorage.setItem(
                "currentUserEmail",
                user.email || ""
            );


            // If we are on index.html,
            // open the correct page

            if (
                window.location.pathname
                    .includes("index.html")
            ) {

                openCorrectPage();

            }

        }

    }
);


// ==========================================
// OPEN CORRECT PAGE
// ==========================================

function openCorrectPage() {

    const role =
        localStorage.getItem(
            "userRole"
        );


    const hash =
        window.location.hash;


    if (
        typeof showPage !== "function"
    ) {
        return;
    }


    // Admin dashboard

    if (
        hash === "#admin" &&
        role === "admin"
    ) {

        showPage("admin");

        return;

    }


    // Citizen report page

    if (
        hash === "#report" &&
        role === "citizen"
    ) {

        showPage("report");

        return;

    }


    // Citizen reports page

    if (
        hash === "#reports" &&
        role === "citizen"
    ) {

        showPage("reports");

        return;

    }

}


// ==========================================
// LOGOUT
// ==========================================

async function logoutUser() {

    try {

        await signOut(auth);


        localStorage.removeItem(
            "userRole"
        );

        localStorage.removeItem(
            "currentUserUid"
        );

        localStorage.removeItem(
            "currentUserEmail"
        );


        window.location.href =
            "index.html";

    }

    catch (error) {

        console.error(
            "Logout failed:",
            error
        );

        alert(
            "Logout failed. Please try again."
        );

    }

}


// ==========================================
// MAKE LOGOUT AVAILABLE
// ==========================================

window.logoutUser =
    logoutUser;