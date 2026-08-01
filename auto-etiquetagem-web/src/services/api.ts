import { getMockClassifyResponse, mockAtendimentos, mockDelay } from '../mocks';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export async function classifyText(text:string){
    if (USE_MOCKS) {
        return mockDelay(getMockClassifyResponse(text));
    }

    const response = await fetch("http://127.0.0.1:8000/classify",{
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({text}),
    });

    if(!response){
        throw new Error("Erro ao classificar");
    }

    return response.json()
}

export async function getAtendimentos() {
    if (USE_MOCKS) {
        return mockDelay(mockAtendimentos);
    }

    const response = await fetch("http://127.0.0.1:8000/atendimentos", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Erro ao carregar histórico");
    }

    return response.json();
}
