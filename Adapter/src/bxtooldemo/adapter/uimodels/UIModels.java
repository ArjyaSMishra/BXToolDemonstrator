package bxtooldemo.adapter.uimodels;

/**
 * @author Arjya Shankar Mishra
 *
 */
public class UIModels {
	
	private Layout layout;
	private Workspace workspace;
	private Change failedDeltas;
	/**
	 * @return the failedDeltas
	 */
	public Change getFailedDeltas() {
		return failedDeltas;
	}
	/**
	 * @param failedDeltas the failedDeltas to set
	 */
	public void setFailedDeltas(Change failedDeltas) {
		this.failedDeltas = failedDeltas;
	}
	/**
	 * @return the layout
	 */
	public Layout getLayout() {
		return layout;
	}
	/**
	 * @param layout the layout to set
	 */
	public void setLayout(Layout layout) {
		this.layout = layout;
	}
	/**
	 * @return the workspace
	 */
	public Workspace getWorkspace() {
		return workspace;
	}
	/**
	 * @param workspace the workspace to set
	 */
	public void setWorkspace(Workspace workspace) {
		this.workspace = workspace;
	}

}
