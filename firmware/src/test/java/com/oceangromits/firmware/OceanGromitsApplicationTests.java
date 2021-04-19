package com.oceangromits.firmware;

import com.oceangromits.firmware.model.Client;
import com.oceangromits.firmware.model.Role;
import com.oceangromits.firmware.repository.ClientRepository;
import com.oceangromits.firmware.security.JwtTokenProvider;
import com.oceangromits.firmware.service.ClientService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
class OceanGromitsApplicationTests {
	@Autowired

	private ClientService TestClientService;
	public Client TestClient;

	private final JwtTokenProvider jwtTokenProvider;
	private final AuthenticationManager authenticationManager;
	private final PasswordEncoder passwordEncoder;
	private final ClientRepository clientRepository;
	private String ReturnedToken;
	private String ExampleToken;
	private String StringId;

	@Autowired
	OceanGromitsApplicationTests(JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder, ClientRepository clientRepository) {
		this.jwtTokenProvider = jwtTokenProvider;
		this.authenticationManager = authenticationManager;
		this.passwordEncoder = passwordEncoder;
		this.clientRepository = clientRepository;
	}

	@Test
	void contextLoads() {
	}


	//ClientService tests
	@Test
	void testCreateAdmin(){

		ReturnedToken=TestClientService.createAdmin(TestClient);
		TestClient.setName("username");
		TestClient.setPassword("password");
		TestClient.setRoles(Arrays.asList(Role.ROLE_VIDEO, Role.ROLE_ADMIN, Role.ROLE_CONNECT));
		ExampleToken=jwtTokenProvider.createToken(TestClient.getName(), TestClient.getRoles());
		assertEquals(ReturnedToken,ExampleToken);

	}

	@Test
	void testgenClientVideoToken(){
		ReturnedToken=TestClientService.genClientVideoToken("1");
		TestClient.setRoles(Arrays.asList(Role.ROLE_VIDEO, Role.ROLE_CONNECT));
		TestClient.setId(1);
		TestClient.setPassword("password");
		StringId=Long.toString(TestClient.getId());
		ExampleToken=jwtTokenProvider.createToken(StringId,TestClient.getRoles());
		assertEquals(ExampleToken,ReturnedToken);
	}

	@Test
	void testgenBasicToken(){
		ReturnedToken=TestClientService.genBasicToken("1");
		TestClient.setRoles(Arrays.asList(Role.ROLE_CONNECT));
		TestClient.setId(1);
		TestClient.setPassword("password");
		StringId=Long.toString(TestClient.getId());
		ExampleToken=jwtTokenProvider.createToken(StringId,TestClient.getRoles());
		assertEquals(ExampleToken,ReturnedToken);
	}




//	@Test
//public void correctUserPass(){
//	TestAuthenticatorService= new WebSocketAuthenticatorService();
//	UsernamePasswordAuthenticationToken result = TestAuthenticatorService.getAuthenticatedOrFail("gromit", "test_pass");
//	assertEquals(result.getPrincipal(),"gromit");
//}

////test whether an empty username is caught as not being valid
//@Test
//public void missingUsername(){
//	TestAuthenticatorService= new WebSocketAuthenticatorService();
//	assertThrows(AuthenticationCredentialsNotFoundException.class,()->{TestAuthenticatorService.getAuthenticatedOrFail(null, "test_pass");});

//}

////test whether an empty password is caught as not being valid
//@Test
//public void missingPassword(){
//	TestAuthenticatorService= new WebSocketAuthenticatorService();
//	assertThrows(AuthenticationCredentialsNotFoundException.class,()->{TestAuthenticatorService.getAuthenticatedOrFail("gromit", null);});

//}


////tests for whether an incorrect username/password or both is valid
//@Test
//public void incorrectUserPass(){
//	TestAuthenticatorService= new WebSocketAuthenticatorService();
//	assertThrows(AuthenticationCredentialsNotFoundException.class,()->{TestAuthenticatorService.getAuthenticatedOrFail("gromit", "wrong");});
//	assertThrows(AuthenticationCredentialsNotFoundException.class,()->{TestAuthenticatorService.getAuthenticatedOrFail("wrong", "test_pass");});
//	assertThrows(AuthenticationCredentialsNotFoundException.class,()->{TestAuthenticatorService.getAuthenticatedOrFail("wrong", "wrong");});
//}

}
