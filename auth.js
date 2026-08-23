import {
    auth,
    googleProvider,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    onAuthStateChanged
} from "./firebase.js";


const ADMIN_EMAILS = [
    "utkarshkumarabhaipur@gmail.com"
];


const citizenLoginBtn = document.getElementById("citizenLoginBtn");

const adminLoginBtn = document.getElementById("adminLoginBtn");


function setLoginType(type) {
    sessionStorage.setItem("fixmycityLoginType", type);
}


async function startGoogleLogin(type) {

    setLoginType(type);

    try {

        await signInWithRedirect(auth, googleProvider);

    } catch (error) {

        console.error("Google sign-in failed:", error);

        sessionStorage.removeItem("fixmycityLoginType");

        alert("Google sign-in could not be started. Please try again.");
    }
}


citizenLoginBtn?.addEventListener("click", () => {

    startGoogleLogin("citizen");

});


adminLoginBtn?.addEventListener("click", () => {

    startGoogleLogin("admin");

});


getRedirectResult(auth).catch((error) => {

    console.error("Google sign-in redirect failed:", error);

    sessionStorage.removeItem("fixmycityLoginType");

    alert("Google sign-in failed. Please try again.");

});


onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    const loginType =
        sessionStorage.getItem("fixmycityLoginType");

    console.log(
        "Signed in:",
        user.displayName,
        user.email
    );


    if (loginType === "admin") {

        const email =
            (user.email || "").toLowerCase();

        const isAdmin =
            ADMIN_EMAILS
                .map(value => value.toLowerCase())
                .includes(email);


        if (!isAdmin) {

            sessionStorage.removeItem(
                "fixmycityLoginType"
            );

            await signOut(auth);

            alert(
                "This Google account is not authorized for Admin Login."
            );

            return;
        }


        sessionStorage.removeItem(
            "fixmycityLoginType"
        );

        window.showPage("admin");


        if (
            typeof window.closeLoginMenu === "function"
        ) {

            window.closeLoginMenu();

        }

        return;
    }


    if (loginType === "citizen") {

        sessionStorage.removeItem(
            "fixmycityLoginType"
        );

        window.showPage("reports");


        if (
            typeof window.closeLoginMenu === "function"
        ) {

            window.closeLoginMenu();

        }

        return;
    }

});



window.addEventListener("load", () => {

    const originalShowPage =
        window.showPage;


    if (
        typeof originalShowPage !== "function"
    ) return;


    window.showPage = function(page) {

        if (
            page === "reports" &&
            !auth.currentUser
        ) {

            startGoogleLogin("citizen");

            return;
        }


        if (page === "admin") {

            if (!auth.currentUser) {

                startGoogleLogin("admin");

                return;
            }


            const email =
                (
                    auth.currentUser.email || ""
                ).toLowerCase();


            const isAdmin =
                ADMIN_EMAILS
                    .map(value =>
                        value.toLowerCase()
                    )
                    .includes(email);


            if (!isAdmin) {

                alert(
                    "Admin access is restricted to authorized accounts."
                );

                return;
            }

        }


        originalShowPage(page);

    };

});