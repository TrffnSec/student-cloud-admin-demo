import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDn8r5s9YVTC8mOYg8eS46yPhVZnkET7A8",
  authDomain: "student-cloud-admin-demo.firebaseapp.com",
  projectId: "student-cloud-admin-demo",
  storageBucket: "student-cloud-admin-demo.firebasestorage.app",
  messagingSenderId: "483301306590",
  appId: "1:483301306590:web:38776232cc4da6f4ded24f",
  measurementId: "G-E7PCQBXTKR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "./dashboard.html";
  } catch (error) {
    document.getElementById("message").innerText = error.message;
  }
};

window.logout = async function () {
  await signOut(auth);
  window.location.href = "./index.html";
};

window.addStudent = async function () {
  const studentName = document.getElementById("studentName").value;
  const projectTitle = document.getElementById("projectTitle").value;
  const technology = document.getElementById("technology").value;

  if (!studentName || !projectTitle || !technology) {
    alert("Please fill all fields");
    return;
  }

  await addDoc(collection(db, "studentProjects"), {
    studentName,
    projectTitle,
    technology,
    createdAt: new Date().toISOString()
  });

  alert("Student project added successfully");
  loadStudents();
};

async function loadStudents() {
  const studentList = document.getElementById("studentList");

  if (!studentList) return;

  studentList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "studentProjects"));

  querySnapshot.forEach((document) => {
    const data = document.data();

    studentList.innerHTML += `
      <div class="student">
        <strong>${data.studentName}</strong><br>
        Project: ${data.projectTitle}<br>
        Technology: ${data.technology}<br>
        <button class="delete" onclick="deleteStudent('${document.id}')">Delete</button>
      </div>
    `;
  });
}

window.deleteStudent = async function (id) {
  await deleteDoc(doc(db, "studentProjects", id));
  alert("Deleted successfully");
  loadStudents();
};

onAuthStateChanged(auth, (user) => {
  const currentPage = window.location.pathname;

  if (currentPage.includes("./dashboard.html") && !user) {
    window.location.href = "index.html";
  }

  if (currentPage.includes("./index.html") && user) {
    window.location.href = "./dashboard.html";
  }
});

loadStudents();