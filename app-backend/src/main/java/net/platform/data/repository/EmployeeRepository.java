package net.platform.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import net.platform.data.model.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>{
	

}
