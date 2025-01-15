document.addEventListener('DOMContentLoaded', () => {
    const btnAgregar = document.getElementById('btnAgregar');
    const modal = document.getElementById('agregarEstudiante');
    const btnCerrarModal = document.getElementById('btnCerrarModal');
    const btnCerrarModalEditar = document.getElementById('btnCerrarModalEditar');
    const btnActualizarEstudiante = document.getElementById('btnActualizarEstudiante');


    // Abrir modal al presionar el botón "Agregar Nuevo Estudiente"
    btnAgregar.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // Cerrar modal al presionar el botón de cerrar
    btnCerrarModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    btnCerrarModalEditar.addEventListener('click', () => {
        modalEditar.style.display = 'none';
      });

    // Cerrar modal al hacer clic fuera del formulario
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
        // Botón del formulario para agregar o editar
    formButton.addEventListener('click', async (event) => {
        event.preventDefault();
    
        if (isEditing) {
                await updateStudent(editingStudentId);
        } else {
                await addStudent(event);
        }
    });
    // Actualizar estudiante
    btnActualizarEstudiante.addEventListener('click', async () => {
    const studentId = document.getElementById('editStudentId').value;
    const updatedStudent = {
      nombre: document.getElementById('editName').value,
      apellido: document.getElementById('editLastName').value,
      edad: document.getElementById('editAge').value,
      correo: document.getElementById('editEmail').value,
      fechaNacimiento: document.getElementById('editBirthDate').value,
      genero: document.getElementById('editGender').value,
      materiasQueToma: document.getElementById('editSubjects').value,
      trabajo: document.getElementById('editJob').value,
    };

    const response = await fetch(`/students/${studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedStudent),
    });

    const result = await response.json();
    alert(result.message);

    if (response.ok) {
      modalEditar.style.display = 'none';
      fetchStudents(); // Actualizar la lista de estudiantes
    }
  });
});

async function fetchStudents() {
    const response = await fetch('/students');
    const students = await response.json();
    renderStudents(students);
}

// Función para agregar un estudiante
async function addStudent(event) {
    event.preventDefault();

    const student = {
        student_id: document.getElementById('student_id').value,
        nombre: document.getElementById('name').value,
        apellido: document.getElementById('lastName').value,
        edad: document.getElementById('age').value,
        correo: document.getElementById('email').value,
        fechaNacimiento: document.getElementById('birthDate').value,
        genero: document.getElementById('gender').value,
        materiasQueToma: document.getElementById('subjects').value,
        trabajo: document.getElementById('job').value,
        direccion: "",  // No está en el formulario, pero puedes añadirlo si lo deseas
    };

    const response = await fetch('/students/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
    });

    const result = await response.json();
    alert(result.message);
    fetchStudents(); // Vuelve a cargar los estudiante
}

// Función para eliminar un estudiante
async function deleteStudent(studentId) {
    const response = await fetch(`/students/${studentId}`, {
        method: 'DELETE',
    });

    const result = await response.json();
    alert(result.message);
    fetchStudents(); // Vuelve a cargar los estudiantes
}

// Función para abrir el modal de edición y rellenar los datos
async function editStudent(studentId) {
    const response = await fetch(`/students/${studentId}`);
    const student = await response.json();
  
    if (!response.ok) {
      alert(student.message);
      return;
    }
  
    // Rellenar el modal de edición
    document.getElementById('editStudentId').value = student.student_id;
    document.getElementById('editName').value = student.nombre;
    document.getElementById('editLastName').value = student.apellido;
    document.getElementById('editAge').value = student.edad;
    document.getElementById('editEmail').value = student.correo;
    document.getElementById('editBirthDate').value = student.fechaNacimiento;
    document.getElementById('editGender').value = student.genero;
    document.getElementById('editSubjects').value = student.materiasQueToma;
    document.getElementById('editJob').value = student.trabajo;
  
    // Mostrar el modal de edición
    const modalEditar = document.getElementById('editarEstudiante');
    modalEditar.style.display = 'flex';
  }

// Función para resetear el formulario
function resetForm() {
    document.getElementById('studentForm').reset();
    const formButton = document.getElementById('formButton');
    formButton.textContent = 'Agregar Estudiante';
    isEditing = false;
    editingStudentId = null;
}

// Función para renderizar los estudiantes en la tabla
function renderStudents(students) {
    const tableBody = document.getElementById('students_table_body');
    tableBody.innerHTML = '';  // Limpiar la tabla antes de llenarla

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.student_id}</td>
            <td>${student.nombre} ${student.apellido}</td>
            <td>${student.edad}</td>
            <td>${student.correo}</td>
            <td><button onclick="deleteStudent('${student.student_id}')">Eliminar</button></td>
            <td><button onclick="editStudent('${student.student_id}')">Editar</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Cargar los estudiantes al cargar la página
document.addEventListener('DOMContentLoaded', fetchStudents);
