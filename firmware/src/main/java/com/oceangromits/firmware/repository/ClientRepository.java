package com.oceangromits.firmware.repository;

import com.oceangromits.firmware.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;

public interface ClientRepository extends JpaRepository<Client, Integer> {
    boolean existsByName(String username);

    Client findByName(String clientName);


    @Transactional
    void deleteByName(String username);

}
