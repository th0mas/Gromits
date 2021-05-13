package com.oceangromits.firmware;

import com.oceangromits.firmware.controller.IndexController;
import com.oceangromits.firmware.controller.SignallerController;
import com.oceangromits.firmware.controller.api.AdminController;
import com.oceangromits.firmware.controller.api.ClientController;
import com.oceangromits.firmware.exceptions.GromitsException;
import com.oceangromits.firmware.exceptions.GromitsExceptionAdvice;
import com.oceangromits.firmware.model.Client;
import com.oceangromits.firmware.model.Role;
import com.oceangromits.firmware.model.TokenMessage;
import com.oceangromits.firmware.model.WebRTCMessage;
import com.oceangromits.firmware.repository.ClientRepository;
import com.oceangromits.firmware.security.JwtTokenProvider;
import com.oceangromits.firmware.service.ClientService;
import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.support.NativeMessageHeaderAccessor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;

import java.security.Principal;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

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

	private JwtTokenProvider jwtTokenProvider;
	private AuthenticationManager authenticationManager;
	private PasswordEncoder passwordEncoder;
	@Autowired
	private ClientRepository clientRepository;
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
	Principal TestPrincipal= new Principal() {
		@Override
		public String getName() {
			return "name";
		}
	};

	@Autowired
	OceanGromitsApplicationTests(JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder, ClientRepository clientRepository) {
		this.jwtTokenProvider = jwtTokenProvider;
		this.authenticationManager = authenticationManager;
		this.passwordEncoder = passwordEncoder;
		this.clientRepository =  clientRepository;
	}

	@Before("")
	public void initialise(){
		this.clientRepository=new ClientRepository() {
			@Override
			public boolean existsByName(String username) {
				return false;
			}

			@Override
			public Client findByName(String clientName) {
				return null;
			}

			@Override
			public void deleteByName(String username) {

			}

			@Override
			public List<Client> findAll() {
				return null;
			}

			@Override
			public List<Client> findAll(Sort sort) {
				return null;
			}

			@Override
			public List<Client> findAllById(Iterable<Integer> integers) {
				return null;
			}

			@Override
			public <S extends Client> List<S> saveAll(Iterable<S> entities) {
				return null;
			}

			@Override
			public void flush() {

			}

			@Override
			public <S extends Client> S saveAndFlush(S entity) {
				return null;
			}

			@Override
			public void deleteInBatch(Iterable<Client> entities) {

			}

			@Override
			public void deleteAllInBatch() {

			}

			@Override
			public Client getOne(Integer integer) {
				return null;
			}

			@Override
			public <S extends Client> List<S> findAll(Example<S> example) {
				return null;
			}

			@Override
			public <S extends Client> List<S> findAll(Example<S> example, Sort sort) {
				return null;
			}

			@Override
			public Page<Client> findAll(Pageable pageable) {
				return null;
			}

			@Override
			public <S extends Client> S save(S entity) {
				return null;
			}

			@Override
			public Optional<Client> findById(Integer integer) {
				return Optional.empty();
			}

			@Override
			public boolean existsById(Integer integer) {
				return false;
			}

			@Override
			public long count() {
				return 0;
			}

			@Override
			public void deleteById(Integer integer) {

			}

			@Override
			public void delete(Client entity) {

			}

			@Override
			public void deleteAll(Iterable<? extends Client> entities) {

			}

			@Override
			public void deleteAll() {

			}

			@Override
			public <S extends Client> Optional<S> findOne(Example<S> example) {
				return Optional.empty();
			}

			@Override
			public <S extends Client> Page<S> findAll(Example<S> example, Pageable pageable) {
				return null;
			}

			@Override
			public <S extends Client> long count(Example<S> example) {
				return 0;
			}

			@Override
			public <S extends Client> boolean exists(Example<S> example) {
				return false;
			}
		};
		this.authenticationManager= new AuthenticationManager() {
			@Override
			public Authentication authenticate(Authentication authentication) throws AuthenticationException {
				return null;
			}
		};
		this.passwordEncoder=new PasswordEncoder() {
			@Override
			public String encode(CharSequence rawPassword) {
				return null;
			}

			@Override
			public boolean matches(CharSequence rawPassword, String encodedPassword) {
				return false;
			}
		};
		this.jwtTokenProvider=new JwtTokenProvider();



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
	void testSignIn(){
		TestClient=new Client();
		TestClient.setName("username");
		TestClient.setPassword(this.passwordEncoder.encode("password"));
		TestClient.setId(1);
		TestClient.setRoles(Arrays.asList(Role.ROLE_VIDEO, Role.ROLE_ADMIN, Role.ROLE_CONNECT));
		this.clientRepository.save(TestClient);
		TestClientService=new ClientService(this.clientRepository,this.passwordEncoder,this.jwtTokenProvider,this.authenticationManager );
		ReturnedToken=TestClientService.signIn(TestClient.getName(),"password");
		ExampleToken=jwtTokenProvider.createToken(TestClient.getName(),TestClient.getRoles());
		assertEquals(ReturnedToken,ExampleToken);
	}

	@Test
	void testCreateAdmin(){//set client service client repository
		TestClient=new Client();
		TestClient.setName("username");
		TestClient.setPassword("password");
		TestClient.setId(1);
		TestClientService=new ClientService(this.clientRepository,this.passwordEncoder,this.jwtTokenProvider,this.authenticationManager );
		ReturnedToken=TestClientService.createAdmin(TestClient);
		TestClient.setRoles(Arrays.asList(Role.ROLE_VIDEO, Role.ROLE_ADMIN, Role.ROLE_CONNECT));
		ExampleToken=jwtTokenProvider.createToken(TestClient.getName(), TestClient.getRoles());
		assertEquals(ReturnedToken,ExampleToken);

	}
	@Test
	void testgenClientVideoToken() throws InterruptedException {
		Thread.sleep(1);
		TestClient=new Client();
		ReturnedToken=TestClientService.genClientVideoToken("1");
		TestClient.setRoles(Arrays.asList(Role.ROLE_VIDEO, Role.ROLE_CONNECT));
		TestClient.setId(1);
		TestClient.setPassword("password");
		StringId=Long.toString(TestClient.getId());
		ExampleToken=jwtTokenProvider.createToken(StringId,TestClient.getRoles());
		ExampleToken.toString();
		ReturnedToken.toString();
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


	//IndexController tests
	@Test
	void testPing(){
		IndexController TestIndexController=new IndexController();
		String ReturnedPing=TestIndexController.ping();
		assertEquals("pong",ReturnedPing);
	}

	//SignallerController tests
	@Test
	void testsendSignal(){

		SignallerController TestSignallerController=new SignallerController();
		WebRTCMessage Testsignal=new WebRTCMessage();
		SimpMessageHeaderAccessor TestheaderAccessor=SimpMessageHeaderAccessor.create();
		TestheaderAccessor.setUser(TestPrincipal);
		WebRTCMessage ReturnedSignal=TestSignallerController.sendSignal(Testsignal,TestheaderAccessor);
		WebRTCMessage ExampleSignal=new WebRTCMessage();
		ExampleSignal.setSender(TestheaderAccessor.getUser().getName());
		assertEquals(ReturnedSignal.getSender(),ExampleSignal.getSender());//tests if the signal senders are the same
		//as can't test if signals are identical
	}


	//GromitsException tests
	@Test
	void testgetMessage(){
		HttpStatus TesthttpStatus=HttpStatus.ACCEPTED;
		GromitsException TestGromitsException=new GromitsException("message",TesthttpStatus);
		String ReturnedMessage=TestGromitsException.getMessage();
		assertEquals(ReturnedMessage,"message");

	}
	@Test
	void testHttpStatus(){
		HttpStatus TesthttpStatus=HttpStatus.ACCEPTED;
		GromitsException TestGromitsException=new GromitsException("message",TesthttpStatus);
		HttpStatus ReturnedHttpStatus=TestGromitsException.getHttpStatus();
		assertEquals(ReturnedHttpStatus,TesthttpStatus);
	}

	//GromitsexceptionAdvice tests
	@Test
	void testgromitsForbiddenHandler(){
		GromitsExceptionAdvice TestGromitsExceptionAdvice=new GromitsExceptionAdvice();
		String ReturnedMessage=TestGromitsExceptionAdvice.gromitsForbiddenHandler(new GromitsException("message",HttpStatus.FORBIDDEN));
		assertEquals(ReturnedMessage,"message");
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
