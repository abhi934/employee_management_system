package net.platform.data.controller;

import java.time.Instant;
import java.util.HashMap;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import net.platform.data.exception.ResourceNotFoundException;
import net.platform.data.model.Employee;
import net.platform.data.model.User;
import net.platform.data.repository.EmployeeRepository;
import net.platform.data.repository.UserRepository;

@CrossOrigin(origins = "http://localhost:4200",methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.DELETE,
        RequestMethod.PATCH,
        RequestMethod.OPTIONS
    },allowedHeaders="*") 
@RestController
@RequestMapping("/api/v1/")	
public class EmployeeController {
	
	@Autowired
	private EmployeeRepository employeeRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@GetMapping("/employees")
    public ResponseEntity<?> getEmployees(@RequestParam("email") String email) {
        // find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (user.getRole().equalsIgnoreCase("HR")) {
            // HR can view all employees
            List<Employee> employees = employeeRepository.findAll();
            return ResponseEntity.ok(employees);
        } else {
            // EMPLOYEE sees only themselves
            List<Employee> filtered = employeeRepository.findAll()
                    .stream()
                    .filter(emp -> emp.getEmailId().equalsIgnoreCase(email))
                    .toList();
            return ResponseEntity.ok(filtered);
        }
    }
	
	//Create Employee REST API
	@PostMapping("/employees")
	@Transactional
	public ResponseEntity<?> createEmployee(@RequestBody Employee employee,
	                                        @RequestParam("email") String email) {
	    // Find the user performing the action
	    User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
	    
	    if (!user.getRole().equalsIgnoreCase("HR")) {
	        return ResponseEntity.status(403).body("Access denied: only HR can add employees.");
	    }
	    
	    if (employee.getEmailId() == null || employee.getEmailId().isBlank()) {
	        return ResponseEntity.badRequest().body("emailId is required for new employees.");
	    }
	    
	    String empEmail=employee.getEmailId().trim();
	    if(userRepository.findByEmail(empEmail).isEmpty()) {
	        User newUser = new User(empEmail, "test123", "EMPLOYEE");
	        userRepository.save(newUser);	    	
	    }
	    
	    if (employee.getStatusChangeAt() == null) {
	        employee.setStatusChangeAt(Instant.now());
	    }

	    Employee saved = employeeRepository.save(employee);
	    return ResponseEntity.ok(saved);
	}

	
	//Get Employee by id
	@GetMapping("/employees/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee doesn't exist with id: " + id));
        return ResponseEntity.ok(employee);
    }
	
	// Update employee by id
	
	@PutMapping("/employees/{id}")
	public ResponseEntity<?> updateEmployee(
	        @RequestParam("email") String email,   // caller's email (from UI/localStorage)
	        @PathVariable Long id,
	        @RequestBody Employee employeeNewDetails) {

		
	    User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

	    Employee employee = employeeRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Employee doesn't exist with id: " + id));

	    // Debug 
	    System.out.println("======= Debug =======");
	    System.out.println("Employee being updated (DB): " + employee.getEmailId());
	    System.out.println("Requester (from param): " + email);
	    System.out.println("Requester Role: " + user.getRole());
	    System.out.println("====================================");

	    boolean isHR   = "HR".equalsIgnoreCase(user.getRole());
	    boolean isSelf = employee.getEmailId() != null
	                     && employee.getEmailId().trim().equalsIgnoreCase(email.trim());

	    if (!(isHR || isSelf)) {
	        return ResponseEntity.status(403).body("Access denied: you can only update your own record.");
	    }

	    if (!isHR && employeeNewDetails.getEmailId() != null
	        && !employeeNewDetails.getEmailId().trim().equalsIgnoreCase(employee.getEmailId().trim())) {
	        return ResponseEntity.status(403).body("Access denied: you cannot change your email.");
	    }

	    employee.setFirstName(employeeNewDetails.getFirstName());
	    employee.setLastName(employeeNewDetails.getLastName());
	    employee.setEmailId(employeeNewDetails.getEmailId()); // HR can change; EMP keeps same due to guard above

	    Employee updatedEmployee = employeeRepository.save(employee);
	    return ResponseEntity.ok(updatedEmployee);
	}

	
    @DeleteMapping("/employees/{id}")
    public ResponseEntity<?> deleteEmployee(@RequestParam("email") String email, @PathVariable Long id) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        if (!user.getRole().equalsIgnoreCase("HR")) {
            return ResponseEntity.status(403).body("Access denied: only HR can delete employees.");
        }

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee doesn't exist with id: " + id));

        employeeRepository.delete(employee);

        Map<String, Boolean> response = new HashMap<>();
        response.put("Deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
	
    @PatchMapping("/employees/{id}/status")
    public ResponseEntity<?> updateStatus(
            @RequestParam("email") String email,
            @PathVariable Long id,
            @RequestParam("active") boolean active) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        if (!user.getRole().equalsIgnoreCase("HR")) {
            return ResponseEntity.status(403).body("Access denied: only HR can change status.");
        }

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee doesn't exist with id: " + id));

        employee.setActive(active);
        employee.setStatusChangeAt(Instant.now());
        Employee saved = employeeRepository.save(employee);
        return ResponseEntity.ok(saved);
    }
	
	
}


