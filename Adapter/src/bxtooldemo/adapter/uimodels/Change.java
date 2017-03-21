package bxtooldemo.adapter.uimodels;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Arjya Shankar Mishra
 *
 */
public class Change {
	
	private List<Element> created;
	private List<Element> deleted;
	private List<Element> moved;
	
	public Change(){
		this.created = new ArrayList<Element>();
		this.deleted = new ArrayList<Element>();
		this.moved = new ArrayList<Element>();
	}
	/**
	 * @return the created
	 */
	public List<Element> getCreated() {
		return created;
	}
	/**
	 * @param created the created to set
	 */
	public void setCreated(List<Element> created) {
		this.created = created;
	}
	/**
	 * @return the deleted
	 */
	public List<Element> getDeleted() {
		return deleted;
	}
	/**
	 * @param deleted the deleted to set
	 */
	public void setDeleted(List<Element> deleted) {
		this.deleted = deleted;
	}
	/**
	 * @return the moved
	 */
	public List<Element> getMoved() {
		return moved;
	}
	/**
	 * @param moved the moved to set
	 */
	public void setMoved(List<Element> moved) {
		this.moved = moved;
	}

}
