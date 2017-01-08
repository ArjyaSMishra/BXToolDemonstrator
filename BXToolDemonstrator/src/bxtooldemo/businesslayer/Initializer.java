package bxtooldemo.businesslayer;

import bxtooldemo.model.*;

public class Initializer {
	
	public int initialize(int height, int width) {
		
		Canvas canvas = new Canvas(height, width);
		
		return canvas.height/5;
	}

}
