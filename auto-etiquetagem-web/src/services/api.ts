export async function classifyText(text:string){
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