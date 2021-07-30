let prices = document.querySelectorAll('#price');
let quantity = document.querySelectorAll('#quantity');
let totalSum = document.querySelector('#total-sum');
let priceTotal = 0;
let cartPrices = [];  

const priceCheck = (prices) => {
    for (let i=0; i < prices.length; i++){
        // console.log(prices[i].innerText.split('$')[1]);
        cartPrices.push(parseFloat(prices[i].innerText.split('$')[1]) * parseInt(quantity[i].innerText));
    } 

    for (let e=0; e < cartPrices.length; e++) {
        priceTotal += cartPrices[e];
    }

    return priceTotal;
};

totalSum.innerText = '$' + priceCheck(prices); 





