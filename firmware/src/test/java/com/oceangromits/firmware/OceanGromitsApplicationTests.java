package com.oceangromits.firmware;

import com.oceangromits.firmware.controller.api.AdminController;
import com.oceangromits.firmware.controller.api.ClientController;
import com.oceangromits.firmware.model.Client;
import com.oceangromits.firmware.model.Role;
import com.oceangromits.firmware.model.TokenMessage;
import com.oceangromits.firmware.model.WebRTCMessage;
import com.oceangromits.firmware.repository.ClientRepository;
import com.oceangromits.firmware.security.JwtTokenProvider;
import com.oceangromits.firmware.service.ClientService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
class OceanGromitsApplicationTests {
	@Autowired
	private ClientService TestClientService;
	@Autowired
	private AdminController TestAdminController;
	@Autowired
	private ClientController TestClientController;

	public Client TestClient;

	private final JwtTokenProvider jwtTokenProvider;
	private final AuthenticationManager authenticationManager;
	private final PasswordEncoder passwordEncoder;
	@Autowired
	private final ClientRepository clientRepository;
	private String ReturnedToken;
	private String ExampleToken;
	private String StringId;

	private TokenMessage ReturnedTokenMessage;

	private TokenMessage ExampleTokenMessage;
	private TokenMessage TestTokenMessage;
	private WebRTCMessage testWebRTCMessage;

	private JsonNode TestContent;

	private WebRTCMessage.SignalType type;
	public enum SignalType {
		VIDEO_OFFER,
		VIDEO_ANSWER,
		NEW_ICE_CANDIDATE,
		DEVICE_LEAVE,
		DEVICE_JOIN
	}

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

	//Client tests
	@Test
	void testgetId(){
		TestClient=new Client();
		TestClient.setId(1);
		Long RetrunedId=TestClient.getId();
		assertEquals(RetrunedId,1);
	}
	@Test
	void testgetName(){
		TestClient=new Client();
		TestClient.setName("username");
		String ReturnedName=TestClient.getName();
		assertEquals(ReturnedName,"username");
	}
	@Test
	void testgetRoles(){
		TestClient=new Client();
		TestClient.setRoles(Arrays.asList(Role.ROLE_VIDEO));
		List<Role> ReturnedRoles=TestClient.getRoles();
		assertEquals(ReturnedRoles,Arrays.asList(Role.ROLE_VIDEO));
	}
	@Test
	void testgetPassword(){
		TestClient=new Client();
		TestClient.setPassword("password");
		String ReturnedPassword=TestClient.getPassword();
		assertEquals(ReturnedPassword,"password");
	}

	//TokenMessage tests
	@Test
	void testgetClientID(){
		TestTokenMessage=new TokenMessage();
		TestTokenMessage.setClientID("id");
		String ReturnedClientId=TestTokenMessage.getClientID();
		assertEquals(ReturnedClientId,"id");
	}
	@Test
	void testgetToken(){
		TestTokenMessage=new TokenMessage();
		TestTokenMessage.setToken("token");
		String ReturnedToken=TestTokenMessage.getToken();
		assertEquals(ReturnedToken,"token");
	}
	
	//WebRTCSignal tests 
	@Test
	void testgetType(){
		testWebRTCMessage =new WebRTCMessage();
		testWebRTCMessage.setSignalType(WebRTCMessage.SignalType.DEVICE_JOIN);
		WebRTCMessage.SignalType ReturnedType= testWebRTCMessage.getSignalType();
		assertEquals(ReturnedType, WebRTCMessage.SignalType.DEVICE_JOIN);
	}
	@Test
	void testgetSender(){
		testWebRTCMessage =new WebRTCMessage();
		testWebRTCMessage.setSender("sender");
		String ReturnedSender= testWebRTCMessage.getSender();
		assertEquals(ReturnedSender,"sender");
	}


	//ClientService tests
	@Test
	void testCreateAdmin(){
		TestClient=new Client();
		TestClient.setName("username");
		TestClient.setPassword("password");
		ReturnedToken=TestClientService.createAdmin(TestClient);
		TestClient.setRoles(Arrays.asList(Role.ROLE_VIDEO, Role.ROLE_ADMIN, Role.ROLE_CONNECT));
		ExampleToken=jwtTokenProvider.createToken(TestClient.getName(), TestClient.getRoles());
		assertEquals(ReturnedToken,ExampleToken);

	}
	@Test
	void testgenClientVideoToken(){
		TestClient=new Client();
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
		TestClient=new Client();
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
