/* Your details. Everything here is shown on the public site, so only put in what you want people to see.
 * Empty fields are simply left out. Until "email" is filled in, the Contact section shows a "setup needed" note.
 */
window.AKHC_CONFIG = {
  /* How people reach you. */
  email: "rentals@akhcstudio.com",
  phone: "",                    // e.g. "+298 123456" (shown and used for tap-to-call)
  address: "",                  // pick-up address, e.g. "Street 1, 100 Tórshavn"
  mapUrl: "",                   // optional link to the address in a map, e.g. a Google Maps or OpenStreetMap link
  hours: { en: "", fo: "" },    // e.g. { en: "Pick-up by appointment, Mon–Fri", fo: "Heinting eftir avtalu, mán–frí" }
  links: [],                    // optional, e.g. [{ label: "Instagram", url: "https://www.instagram.com/yourname" }]

  /* Company line in the footer (taken from your invoice header; delete a line if you don't want it shown). */
  company: "ÍVF AKHC",
  cvr: "00675210",

  /* Short links for "Save or share this list": the address of the small store that keeps a shared list in scrambled
   * form (the same one the signing page uses). Leave empty and the page makes a long link that holds the list itself. */
  store: "https://akhc-sign-default-rtdb.europe-west1.firebasedatabase.app",

  /* Sending straight from the page: the access key of a form-to-email service (Web3Forms, web3forms.com).
   * With a key, "Send quote request" mails the request to the address the key was made for, without opening the
   * visitor's email app. The key is public by design: it can only send to that one address.
   * Empty = the visitor's own email app is used, as before. */
  formKey: "a81571f6-9d08-48ae-8588-c49844713c6c"
};
