document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("cookiesAccepted")) {
        const consentBar = document.createElement("div");
        consentBar.className = "fixed bottom-0 w-full bg-gray-900 text-white p-4 flex justify-between items-center z-50 text-sm";
        consentBar.innerHTML = `
            <span>ჩვენ ვიყენებთ ქუქი-ფაილებს საუკეთესო გამოცდილებისთვის.</span>
            <button id="acceptCookies" class="bg-blue-600 px-4 py-1 rounded ml-4 hover:bg-blue-500">ვეთანხმები</button>
        `;
        document.body.appendChild(consentBar);

        document.getElementById("acceptCookies").onclick = () => {
            localStorage.setItem("cookiesAccepted", "true");
            consentBar.remove();
        };
    }
});
