package bxtooldemo.adapter.uimodels;

import java.util.List;

/**
 * @author Arjya Shankar Mishra
 *
 */
public class Workspace extends Canvas {

	private List<Circle> objects;
	private List<Item> objectTypeList;
	
	public Workspace(){
		super(500, 500);
	}

	/**
	 * @return the objects
	 */
	public List<Circle> getObjects() {
		return objects;
	}

	/**
	 * @param objects the objects to set
	 */
	public void setObjects(Circle object) {
		this.objects.add(object);
	}

	/**
	 * @return the objectTypeList
	 */
	public List<Item> getObjectTypeList() {
		return objectTypeList;
	}

	/**
	 * @param objectTypeList the objectTypeList to set
	 */
	public void setObjectTypeList(List<Item> objectTypeList) {
		this.objectTypeList = objectTypeList;
	}
}
