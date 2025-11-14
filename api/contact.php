<?php
<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_GET['path'] ?? '', '/'));

// GET semua contacts atau by ID
if ($method === 'GET') {
    if (!empty($request[0])) {
        // GET by ID
        getContactById($request[0]);
    } else {
        // GET semua
        getAllContacts();
    }
}

// POST - Create contact
elseif ($method === 'POST') {
    createContact();
}

// PUT - Update status
elseif ($method === 'PUT') {
    if (!empty($request[0])) {
        updateContact($request[0]);
    }
}

// DELETE - Delete contact
elseif ($method === 'DELETE') {
    if (!empty($request[0])) {
        deleteContact($request[0]);
    }
}

// ===== FUNCTION =====

// GET All Contacts
function getAllContacts() {
    global $conn;
    
    try {
        $query = "SELECT * FROM contacts ORDER BY created_at DESC";
        $result = $conn->query($query);
        
        if ($result === false) {
            throw new Exception("Query Error: " . $conn->error);
        }
        
        $contacts = [];
        while ($row = $result->fetch_assoc()) {
            $contacts[] = $row;
        }
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $contacts,
            'count' => count($contacts)
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => '❌ ' . $e->getMessage()
        ]);
    }
}

// GET Contact by ID
function getContactById($id) {
    global $conn;
    
    try {
        $id = intval($id);
        $query = "SELECT * FROM contacts WHERE id = $id";
        $result = $conn->query($query);
        
        if ($result === false) {
            throw new Exception("Query Error: " . $conn->error);
        }
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => '❌ Pesan tidak ditemukan'
            ]);
            return;
        }
        
        $contact = $result->fetch_assoc();
        
        // Update status to 'read'
        $updateQuery = "UPDATE contacts SET status = 'read' WHERE id = $id";
        $conn->query($updateQuery);
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $contact
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => '❌ ' . $e->getMessage()
        ]);
    }
}

// CREATE Contact
function createContact() {
    global $conn;
    
    try {
        // Get JSON data
        $data = json_decode(file_get_contents("php://input"), true);
        
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $message = trim($data['message'] ?? '');
        
        // Validasi
        if (empty($name) || empty($email) || empty($message)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => '❌ Harap isi semua field dengan benar'
            ]);
            return;
        }
        
        // Validasi email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => '❌ Format email tidak valid'
            ]);
            return;
        }
        
        // Validasi panjang pesan
        if (strlen($message) < 10) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => '❌ Pesan minimal 10 karakter'
            ]);
            return;
        }
        
        // Escape input untuk security
        $name = $conn->real_escape_string($name);
        $email = $conn->real_escape_string($email);
        $message = $conn->real_escape_string($message);
        
        // Insert ke database
        $query = "INSERT INTO contacts (name, email, message) 
                  VALUES ('$name', '$email', '$message')";
        
        if ($conn->query($query) === true) {
            $id = $conn->insert_id;
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => '✅ Pesan berhasil dikirim!',
                'data' => [
                    'id' => $id,
                    'name' => $name,
                    'email' => $email,
                    'message' => $message,
                    'status' => 'pending',
                    'created_at' => date('Y-m-d H:i:s')
                ]
            ]);
        } else {
            throw new Exception($conn->error);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => '❌ Terjadi kesalahan: ' . $e->getMessage()
        ]);
    }
}

// UPDATE Contact Status
function updateContact($id) {
    global $conn;
    
    try {
        $data = json_decode(file_get_contents("php://input"), true);
        $status = trim($data['status'] ?? '');
        $id = intval($id);
        
        // Validasi status
        $validStatus = ['pending', 'read', 'replied'];
        if (!in_array($status, $validStatus)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => '❌ Status tidak valid'
            ]);
            return;
        }
        
        // Check if contact exists
        $checkQuery = "SELECT id FROM contacts WHERE id = $id";
        $result = $conn->query($checkQuery);
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => '❌ Pesan tidak ditemukan'
            ]);
            return;
        }
        
        // Update
        $query = "UPDATE contacts SET status = '$status' WHERE id = $id";
        
        if ($conn->query($query) === true) {
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => '✅ Status berhasil diupdate'
            ]);
        } else {
            throw new Exception($conn->error);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => '❌ Error: ' . $e->getMessage()
        ]);
    }
}

// DELETE Contact
function deleteContact($id) {
    global $conn;
    
    try {
        $id = intval($id);
        
        // Check if contact exists
        $checkQuery = "SELECT id FROM contacts WHERE id = $id";
        $result = $conn->query($checkQuery);
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => '❌ Pesan tidak ditemukan'
            ]);
            return;
        }
        
        // Delete
        $query = "DELETE FROM contacts WHERE id = $id";
        
        if ($conn->query($query) === true) {
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => '✅ Pesan berhasil dihapus'
            ]);
        } else {
            throw new Exception($conn->error);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => '❌ Error: ' . $e->getMessage()
        ]);
    }
}
?>