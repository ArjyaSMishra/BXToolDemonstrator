package bxtooldemo.adapter.uimodels;

import java.awt.Color;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;



/**
 * @author Arjya Shankar Mishra
 *
 */
public class UIGroup {
	
	public List<Rectangle> blocks;
	public String fillColor;
	
	public UIGroup(){
		this.blocks = new ArrayList<Rectangle>();
	}

	
//	public UIGroup(){
//		Random rand = new Random();
//		Color color = new Color(rand.nextInt(0xFFFFFF));
//		System.out.println(color.toString());
//	}

	/**
	 * @return the blocks
	 */
	public List<Rectangle> getBlocks() {
		return this.blocks;
	}

	/**
	 * @param blocks the blocks to set
	 */
	public void setBlocks(List<Rectangle> blocks) {
		this.blocks = blocks;
	}

	/**
	 * @return the fillColor
	 */
	public String getFillColor() {
		return this.fillColor;
	}

	/**
	 * @param fillColor the fillColor to set
	 */
	public void setFillColor(String fillColor) {
		this.fillColor = fillColor;
	}

}
