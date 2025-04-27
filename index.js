
const container = document.getElementById("container")
const state = {
    checkBoxes: {},
    config: {},
    inputDims: [0, 0, 0],
    inputDimsSorted: [0, 0, 0],
    availableBoxes: [],
    printScale: 7,
}

function gen_checkBoxLabel(id, text, checked, state_collection) {
    const checkboxDiv = document.createElement("span")

    const label = document.createElement("label")
    label.textContent = text
    label.setAttribute("for", id)

    const checkbox = document.createElement("input")
    checkbox.setAttribute("type", "checkbox")
    checkbox.checked = checked
    checkbox.id = id

    state_collection[id] = checked

    function toggle() {
        state_collection[id] = !state_collection[id]
        gen_chart()
    }
    label.addEventListener("mouseup", toggle)
    checkbox.addEventListener("mouseup", toggle)
    checkboxDiv.appendChild(checkbox)
    checkboxDiv.appendChild(label)
    return checkboxDiv
}

function gen_checkBoxes() {
    const checkBoxesDiv = document.createElement("div")
    checkBoxesDiv.textContent = "Packing levels: "
    const np_checkBox = gen_checkBoxLabel("npCheckbox", "No Pack", false, state.checkBoxes)
    const std_checkBox = gen_checkBoxLabel("stdCheckbox", "Standard Pack", true, state.checkBoxes)
    const frag_checkBox = gen_checkBoxLabel("fragCheckbox", "Fragile Pack", true, state.checkBoxes)
    const cust_checkBox = gen_checkBoxLabel("custCheckbox", "Custom Pack", false, state.checkBoxes)
    const tele_checkBox = gen_checkBoxLabel("teleCheckbox", "Telescope Pack", false, state.checkBoxes)
    checkBoxesDiv.appendChild(np_checkBox)
    checkBoxesDiv.appendChild(std_checkBox)
    checkBoxesDiv.appendChild(frag_checkBox)
    checkBoxesDiv.appendChild(cust_checkBox)
    checkBoxesDiv.appendChild(tele_checkBox)

    container.appendChild(checkBoxesDiv)
}

function gen_configBoxes() {
    const configDiv = document.createElement("div")
    const showImpossible = gen_checkBoxLabel("showImpossible", "Show impossible boxes", false, state.config)
    const showNoSpace = gen_checkBoxLabel("showNoSpace", "Show no space boxes", false, state.config)
    const showPossible = gen_checkBoxLabel("showPossible", "Show possible boxes", true, state.config)
    const scorePriority = gen_checkBoxLabel("scorePriority", "Sort by score", false, state.config)

    configDiv.appendChild(scorePriority)
    configDiv.appendChild(showImpossible)
    configDiv.appendChild(showNoSpace)
    configDiv.appendChild(showPossible)

    container.appendChild(configDiv)
}

function gen_dimInputs() {
    const inputDiv = document.createElement("div")

    const inOne = document.createElement("input")
    inOne.setAttribute("placeholder", "x")
    const inTwo = document.createElement("input")
    inTwo.setAttribute("placeholder", "y")
    const inThree = document.createElement("input")
    inThree.setAttribute("placeholder", "z")

    const clearBtn = document.createElement("button")
    clearBtn.textContent = "Clear inputs"
    inputDiv.appendChild(clearBtn)
    clearBtn.addEventListener("mouseup", () => {
        const chartDiv = document.getElementById("chartContainer")
        if (chartDiv) {
            chartDiv.remove()
        }
        inOne.value = ""
        inTwo.value = ""
        inThree.value = ""
        state.inputDims = [0, 0, 0]
        inOne.focus()
    })

    inOne.addEventListener("keyup", (e) => {
        const val = parseInt(e.target.value)
        if (!isNaN(val)) {    
            state.inputDims[0] = val
            state.inputDimsSorted = state.inputDims.toSorted((a, b) => {return b - a}) 
            gen_chart()
        }
    })
    inTwo.addEventListener("keyup", (e) => {
        const val = parseInt(e.target.value)
        if (!isNaN(val)) {
            state.inputDims[1] = val
            state.inputDimsSorted = state.inputDims.toSorted((a, b) => {return b - a}) 
            gen_chart()
        }
    })
    inThree.addEventListener("keyup", (e) => {
        const val = parseInt(e.target.value)
        if (!isNaN(val)) {
            state.inputDims[2] = val
            state.inputDimsSorted = state.inputDims.toSorted((a, b) => {return b - a}) 
            gen_chart()
        }
    })

    inputDiv.appendChild(inOne)
    inputDiv.appendChild(inTwo)
    inputDiv.appendChild(inThree)

    container.appendChild(inputDiv)

}

function gen_html() {
    const infoDiv = document.createElement("div")

    const helpButton = document.createElement("button")
    infoDiv.appendChild(helpButton)
    helpButton.textContent = "Help"
    helpButton.addEventListener("click", () => {
        const helpDiv = document.getElementById("helpDiv")
        if (helpDiv) {
            helpDiv.remove()
        } else {
            const helpDiv = document.createElement("div")
            helpDiv.id = "helpDiv"
            helpDiv.innerHTML =
                `<div>The first row filters which packing levels are shown. </div>
                <div>Sort by score orders the boxes by score (how well the item fits in the box) and price</div>
                <div>Other options toggle which recomendation levels should be available</div>
                <div>Impossible - The item is too big for the box</div>
                <div>No space - The item theoretically fits, but there is 0 space left in the box for at least 1 dimension</div>
                <div>Possible - The item fits, but there some packing material space will be sacrificed</div>
                <div>fits - The item fits in the box without any isuses (probably with extra space to work with)</div>
                <div>The third row is the input for the dimensions of the item to be packed. (Order doesn't matter) </div>
                `
            helpDiv.style.backgroundColor = "#bbbbbb"
            infoDiv.appendChild(helpDiv)
        }
    })

    const debugButton = document.createElement("button")
    infoDiv.appendChild(debugButton)
    debugButton.textContent = "Show Debug"
    debugButton.addEventListener("click", () => {
        const debugDiv = document.getElementById("debugDiv")
        if (debugDiv) {
            debugDiv.remove()
        } else {
            const debugDiv = document.createElement("div")
            debugDiv.id = "debugDiv"
            
            const dumpBtn = document.createElement("button")
            dumpBtn.textContent = "Dump state"
            dumpBtn.addEventListener("click", () => {
                console.log(JSON.stringify(state))
            })
            debugDiv.appendChild(dumpBtn)

            const scaleVal = document.createElement("input")
            scaleVal.setAttribute("type", "number")
            scaleVal.value = state.printScale
            scaleVal.addEventListener("change", (e) => {
                const val = parseFloat(e.target.value)
                if (!isNaN(val)) {
                    state.printScale = val
                    gen_chart()
                }
            })
            debugDiv.appendChild(scaleVal)

            const commentBox = document.createElement("input")
            commentBox.setAttribute("type", "text")
            commentBox.setAttribute("placeholder", "Comment")
            const commentBtn = document.createElement("button")
            commentBtn.textContent = "Send comment"
            commentBtn.addEventListener("click", () => {
                const comment = commentBox.value
                commentBox.value = ""
                if (comment) {
                    fetch("/comments", {
                        method: "POST",
                        body: JSON.stringify({text: comment}),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                }
            })
            debugDiv.appendChild(commentBox)
            debugDiv.appendChild(commentBtn)

            infoDiv.appendChild(debugDiv)
        }
    })
    // container.appendChild(infoDiv)
    
    // debugButton.addEventListener("click", () => console.log(JSON.stringify(state)))
    container.appendChild(infoDiv)
    gen_checkBoxes()
    gen_configBoxes()
    gen_dimInputs()
}

function gen_chart() {
    let chartDiv = document.getElementById("chartContainer")
    if (chartDiv) {
        chartDiv.remove()
    }
    chartDiv = document.createElement("div")
    chartDiv.id = "chartContainer"
    const table = document.createElement("table")
    const header = document.createElement("tr")
    for (const text of ["Score (fit accuracy)", "Box Dims", "Pack Level", "Price", "Recomendation", "Comments", "Boxes Used"]) {
        const th = document.createElement("th")
        th.textContent = text
        header.appendChild(th)
    };
    table.appendChild(header)
    const boxResultCollection = []
    for (const box of state.availableBoxes) {
        const boxResults = box.gen_boxResults()
        for (const result of boxResults) {
            if (result.recomendationLevel == "impossible" && !state.config["showImpossible"]) {
                continue
            }
            if (result.recomendationLevel == "no space" && !state.config["showNoSpace"]) {
                continue
            }
            if (result.recomendationLevel == "possible" && !state.config["showPossible"]) {
                continue
            }
            boxResultCollection.push(result)
        }
    }
    if (state.config["scorePriority"]) {
        boxResultCollection.sort((a, b) => {return a.score - b.score})
    } else {
        boxResultCollection.sort((a, b) => {return a.price - b.price})
    }
    for (const result of boxResultCollection) {
        const row = document.createElement("tr")
        const score = document.createElement("td")
        score.style.margin = "100px"
        score.textContent = result.score
        const boxDims = document.createElement("td")
        boxDims.textContent = `[${result.dimensions[0]}, ${result.dimensions[1]}, ${result.dimensions[2]}]`
        const packLevel = document.createElement("td")
        if (result.packLevel == "No Pack") {
            packLevel.textContent = "Box"
        } else {
            packLevel.textContent = result.packLevel
        }
        const price = document.createElement("td")
        price.textContent = result.price
        const recomendation = document.createElement("td")
        recomendation.textContent = result.recomendationLevel
        const comment = document.createElement("td")
        comment.textContent = result.comment
        const boxCount = document.createElement("td")
        boxCount.textContent = result.boxCount

        row.appendChild(score)
        row.appendChild(boxDims)
        row.appendChild(packLevel)
        row.appendChild(price)
        row.appendChild(recomendation)
        row.appendChild(comment)
        row.appendChild(boxCount)

        // printing
        const printBtn = document.createElement("button")
    
        printBtn.textContent = "Print"
        printBtn.addEventListener("click", () => {
            var frame = document.createElement('iframe');
            frame.srcdoc = 
            `<html>
                <head><title>Print</title>
                <style>
                    div {
                        font-size: ${state.printScale}vw;
                    }
                    span {
                        margin-left: 10vw;
                    }
                </style>
                </head>
                <body onload="window.print()">
                <div>
                    Box dimensions: <br>
                    <span>${boxDims.outerHTML}</span> <br>
                    Packing level: <br>
                    <span>${packLevel.outerHTML}</span> <br>
                    Price: $${price.outerHTML} <br> 
                    Recomendation: <br>
                    <span>${recomendation.outerHTML}</span> <br>
                    Comments: ${comment.outerHTML} <br>
                    Boxes used: ${boxCount.outerHTML} <br>
                </div>
                </body>
            </html>`;
            document.body.appendChild(frame);
            setTimeout(() => {
                frame.remove();
            }, 1000);
        })
        row.appendChild(printBtn)

        table.appendChild(row)
    }
    chartDiv.appendChild(table)
    container.appendChild(chartDiv)
}

class BoxResult {
    constructor(dimensions, packLevel, price, recomendationLevel, boxCount, comment, score) {
        this.dimensions = dimensions    // Box dims
        this.packLevel = packLevel  // Packing level
        this.price = price  // Selection price
        this.recomendationLevel = recomendationLevel    // fits vs possible vs no space vs impossible
        this.boxCount = boxCount    // Telescoping boxes needed
        this.comment = comment  // Might be needed to explain the status?
        this.score = score  // How good is the fit?
    }
}

class Box {
    constructor(dimensions, open_dim, prices) {
        // dimensions: [int, int, int] -> What are the dimensions of the box
        // open_dim: int -> Along which dimension does the box open (for tele)
        // prices: [np_float, sp_float, fp_float, cp_float] -> price for each packing level
        const open_dim_val = dimensions[open_dim]
        this.dimensions = dimensions.toSorted((a, b) => b - a)     // Just to presort by size
        this.open_dim = this.dimensions.findIndex((e) => {return e == open_dim_val})
        this.prices = prices
    }
    
    static NormalBox(dimensions, prices) {
        return new Box(dimensions, 2, prices)
    }

    boxSpace() {
        // How much space between box and item(s)
        return [this.dimensions[0] - state.inputDimsSorted[0], this.dimensions[1] - state.inputDimsSorted[1], this.dimensions[2] - state.inputDimsSorted[2]]
    }

    calcScore(space, expectedSpace) {
        // space: [x, y, z] -> space in each dimension in the box
        // expected space: int -> how much space each dimension should have
        return (space[0] - expectedSpace) ** 2 + (space[1] - expectedSpace) ** 2 + (space[2] - expectedSpace) ** 2 
    }

    gen_boxResults() {
        // Based on current state
        const collection = []
        const space = this.boxSpace()
        const lowestDim = Math.min(...space)
        if (state.checkBoxes["npCheckbox"]) {
            const packingSpace = 0
            let recomendation = ""
            if (lowestDim < 0) {
                recomendation = "impossible"
            } else if (lowestDim == 0) {
                recomendation = "no space"
            } else {
                recomendation = "fits"
            }
            const result = new BoxResult(this.dimensions, "No Pack", this.prices[0], recomendation, 1, "", this.calcScore(space, packingSpace))
            collection.push(result)
        }
        if (state.checkBoxes["stdCheckbox"]) {
            const packingSpace = 2
            let recomendation = ""
            if (lowestDim < 0) {
                recomendation = "impossible"
            } else if (lowestDim == 0) {
                recomendation = "no space"
            } else if (lowestDim > 0 && lowestDim < packingSpace) {
                recomendation = "possible"
            } else {
                recomendation = "fits"
            }
            const result = new BoxResult(this.dimensions, "Standard Pack", this.prices[1], recomendation, 1, "", this.calcScore(space, packingSpace))
            collection.push(result)
        }
        if (state.checkBoxes["fragCheckbox"]) {
            const packingSpace = 4
            let recomendation = ""
            if (lowestDim < 0) {
                recomendation = "impossible"
            } else if (lowestDim == 0) {
                recomendation = "no space"
            } else if (lowestDim > 0 && lowestDim < packingSpace) {
                recomendation = "possible"
            } else {
                recomendation = "fits"
            }
            const result = new BoxResult(this.dimensions, "Fragile Pack", this.prices[2], recomendation, 1, "", this.calcScore(space, packingSpace))
            collection.push(result)
        }
        if (state.checkBoxes["custCheckbox"]) {
            const packingSpace = 6
            let recomendation = ""
            if (lowestDim < 0) {
                recomendation = "impossible"
            } else if (lowestDim == 0) {
                recomendation = "no space"
            } else if (lowestDim > 0 && lowestDim < packingSpace) {
                recomendation = "possible"
            } else {
                recomendation = "fits"
            }
            const result = new BoxResult(this.dimensions, "Custom Pack", this.prices[3], recomendation, 1, "", this.calcScore(space, packingSpace))
            collection.push(result)
        }
        if (state.checkBoxes["teleCheckbox"]) {
            const packingSpace = 4
            // Box constraints
            let largerConstraint = 0
            let smallerConstraint = 0
            if (this.open_dim == 0) {
                largerConstraint = this.dimensions[1]
                smallerConstraint = this.dimensions[2]
            } else if (this.open_dim == 1) {
                largerConstraint = this.dimensions[0]
                smallerConstraint = this.dimensions[2]
            } else {
                largerConstraint = this.dimensions[0]
                smallerConstraint = this.dimensions[1]
            }
            const minLength = state.inputDimsSorted[0] + packingSpace
            const largerSpace = largerConstraint - state.inputDimsSorted[1]
            const smallerSpace = smallerConstraint - state.inputDimsSorted[2]
            const score = (largerSpace - packingSpace) ** 2 + (smallerSpace - packingSpace) ** 2
            const flapSize = smallerConstraint / 2
            const endBoxLen = this.dimensions[this.open_dim] + flapSize
            const centerBoxLen = endBoxLen + flapSize
            const centerRemaining = minLength - 2 * endBoxLen
            let centerBoxes = 0
            if (centerRemaining > 0) {
                centerBoxes = Math.ceil(centerRemaining / centerBoxLen)
            }
            const totalBoxes = 2 + centerBoxes
            const totalCost = this.prices[3] + this.prices[1] * (totalBoxes - 1)

            let recomendation = ""
            if (largerSpace < 0 || smallerSpace < 0) {
                recomendation = "impossible"
            } else if (largerSpace == 0 || smallerSpace == 0) {
                recomendation = "no space"
            } else if (largerSpace < packingSpace || smallerSpace < packingSpace) {
                recomendation = "possible"
            } else {
                recomendation = "fits"
            }
            const result = new BoxResult(this.dimensions, "Telescoped", totalCost, recomendation, totalBoxes, `Expected dims: [${minLength}, ${largerConstraint}, ${smallerConstraint}]`, score)       
            collection.push(result)
        }
        return collection
    }

}

function create_box() {
    new Box([6, 6, 6], 2, [5.99, 8.89, 10.74, 12.48])

}

function load_boxes() {
    // Box(dimensions, open_dim, prices)
    const boxes = [
        Box.NormalBox([6, 6, 6], [5.99, 8.89, 10.74, 12.48]),
        Box.NormalBox([8, 8, 8], [7.99, 12.17, 15.91, 19.25]),
        Box.NormalBox([10, 10, 10], [10.89, 16.48, 22.43, 26.47]),
        Box.NormalBox([12, 10, 8], [8.49, 14.07, 19.97, 23.98]),
        Box.NormalBox([12, 12, 6], [10.99, 16.51, 22.31, 26.27]),
        Box.NormalBox([12, 12, 12], [13.99, 21.15, 28.59, 35.57]),
        Box.NormalBox([14, 14, 14], [18.99, 27.93, 38.20, 46.20]),
        Box.NormalBox([15, 12, 10], [14.75, 21.99, 29.62, 36.72]),
        Box.NormalBox([16, 16, 4], [15.49, 21.17, 27.99, 32.57]),
        Box.NormalBox([16, 16, 16], [18.49, 28.40, 40.78, 49.94]),
        Box.NormalBox([17, 11, 8], [13.49, 19.53, 26.69, 31.45]),
        Box.NormalBox([18, 18, 18], [21.99, 34.17, 50.02, 60.50]),
        Box.NormalBox([20, 12, 12], [19.99, 29.07, 39.73, 47.96]),
        Box.NormalBox([20, 20, 12], [21.79, 32.24, 45.92, 55.81]),
        Box.NormalBox([20, 20, 20], [30.99, 44.71, 63.28, 75.25]),
        Box.NormalBox([24, 16, 12], [19.99, 30.32, 43.80, 53.58]),
        Box.NormalBox([24, 18, 6], [20.99, 29.93, 41.22, 49.84]),
        Box.NormalBox([24, 18, 18], [23.79, 37.38, 55.80, 67.69]),
        Box.NormalBox([24, 24, 16], [27.49, 42.11, 62.40, 75.30]),
        Box.NormalBox([24, 24, 24], [42.89, 61.76, 86.72, 103.17]),
        Box.NormalBox([26, 20, 20], [43.65, 60.13, 81.59, 96.17]),
        Box.NormalBox([30, 24, 6], [37.49, 47.71, 63.21, 74.17]),
        Box.NormalBox([30, 17, 16], [22.49, 36.40, 55.66, 68.03]),
        Box.NormalBox([30, 30, 16], [32.49, 51.84, 78.36, 95.67]),
        Box.NormalBox([36, 16, 16], [25.29, 39.98, 60.94, 74.27]),
        new Box([36, 20, 20], 0, [34.59, 53.95, 80.21, 97.39]),
        Box.NormalBox([36, 24, 10], [32.49, 46.81, 68.43, 82.11]),
        new Box([36, 29, 5.5], 1, [45.49, 57.82, 78.60, 91.88]),
        new Box([36, 30, 8], 1, [43.49, 57.84, 81.17, 95.79]),
        new Box([44, 35, 5.5], 0, [41.49, 55.81, 83.50, 100.51]),
        new Box([48, 6, 6], 0, [19.99, 27.45, 36.29, 44.44]),
        new Box([48, 10, 10], 0, [22.79, 33.44, 48.44, 59.90]),
        new Box([48, 15, 15], 0, [41.50, 58.44, 82.35, 98.39]),
        new Box([50, 20, 10], 0, [56.99, 73.41, 97.70, 113.96]),
        new Box([56, 32, 10], 0, [81.99, 102.37, 139.64, 163.26]),
        new Box([52, 30, 9], 0, [100, 200, 300, 400]),
        new Box([42, 32, 6], 0, [100, 200, 300, 400]),

    ]
    const testBox = new Box([6, 6, 6], 2, [5.99, 8.89, 10.74, 12.48])
    state.availableBoxes = boxes
}


gen_html()
load_boxes()
gen_chart()