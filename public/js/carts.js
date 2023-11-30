const tableElements = document.getElementsByClassName("cartTable");
const idCart = tableElements[0].id;
const deleteButtons = document.getElementsByClassName("outline");
for (let i = 0; i < deleteButtons.length; i++) {
    const idProd = deleteButtons[i].id.slice(10, undefined);
    deleteButtons[i].addEventListener("click", async (event) => {
        const URL = `http://localhost:8080/api/carts/${idCart}/product/${idProd}`
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: null,
        };
        fetch(URL, options)
            .then(response => response.json())
            .catch(error => console.log("error", error))
            .then(data => {
                alert(JSON.stringify(data));    
                location.reload();
            });
    });
}
