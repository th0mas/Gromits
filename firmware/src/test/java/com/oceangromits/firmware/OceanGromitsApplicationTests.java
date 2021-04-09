package com.oceangromits.firmware;


import com.oceangromits.firmware.controller.SignallerController;
import com.oceangromits.firmware.model.WebRTCSignal;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
class OceanGromitsApplicationTests {

	@Test
	void contextLoads() {
	}

	//tests for signal crontroller

	//test whether user is connecting to a full instance (need to add paremeters to joinClient method)
	@Test
	public void signalControlTests(){
		SignallerController testSignallerController = new SignallerController();
		WebRTCSignal isfull = testSignallerController.joinClient();//not too sure on correct parameters to make it soi there's >2 clients
		assertEquals(isfull,null);

	}


}
