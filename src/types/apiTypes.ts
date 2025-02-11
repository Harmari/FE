export interface Designer {
	name: string;
	address: string;
	area: string;
	specialty: string;
	faceToFacePrice: number;
	nonFaceToFacePrice: number;
	consultationType: string[];
	introduction: string;
}

export interface DesignersResponse {
	designers: Designer[];
};	
