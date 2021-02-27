class Habitat {
    constructor(name) {
        this.name = name;
        this.animals = [];
    }
    
    addAnimal(name, number) {
        console.log("in addAnimal")
        console.log("Name" + name)
        console.log.log("Number" + number)
        this.animals.push(new Animal(name, number));
    }
}

class Animal {
    constructor(name, number) {
        this.name = name;
        this.number = number;
    }
}

class HabitatService {
    static url = "https://crudcrud.com/api/9051bd1a13694487827985406b3bbb0e/unicorns";    

    static getAllHabitats() {
        return $.get(this.url);
    }

    static getHabitat(id) {
        return $.get(this.url + `/${id}`);
    }

    static createHabitat(habitat) {
        console.log("habitat " + habitat);
        console.log("habitat.name " + habitat.name);
        console.log("habitat.habitat " + habitat.habitat);
        return $.ajax({
            url: this.url, 
            dataType: 'json',
            data: JSON.stringify(habitat),
            contentType: 'application/json',
            type: "POST"
        });
    }

    // static updateDate(date) {
    //     return $.ajax({
    //         url: this.url+ `/${date._id}`,
    //         dataType: 'json',
    //         data: JSON.stringify({
    //             "date" : date.date,
    //             "reservations" : date.reservations}),
    //         contentType: 'application/json',
    //         type: 'PUT'
    //     });
    // }
 
    
    
    static updateHabitat(habitat) {
        console.log("habitat " + habitat);
        console.log("habitat.name " + habitat.name);
        console.log("habitat.habitat " + habitat.habitat);
        console.log("habitat.animals " + habitat.animals);
        console.log("JSON.stringify(habitat) " + JSON.stringify(habitat));
        console.log("JSON.stringify(habitat.name) " + JSON.stringify(habitat.name));
        console.log("JSON.stringify(habitat.habitat) " + JSON.stringify(habitat.habitat));
        console.log("JSON.stringify(habitat.animals) " + JSON.stringify(habitat.animals));
        return $.ajax({
            url: this.url+ `/${habitat._id}`,
            dataType: 'json',
            data: JSON.stringify({
                "habitat" : habitat.name,
                // "habitat" : habitat.habitat,
                "animals" : habitat.animals}),
            contentType: 'application/json',
            type: 'PUT'
        });
    };


    // static updateHabitat(habitat) {
    //     console.log("Hooray in updateHabitat")
    //     console.log("habitat name" + habitat.name)
    //     console.log("habitat below")
    //     console.log(habitat)
    //     console.log("habitat.animals below")
    //     console.log(habitat.animals)
    //     console.log("JSON.stringify(habitat.animals) below")
    //     console.log(JSON.stringify(habitat.animals))
    //     console.log(habitat._id + " habitat._id")
    //     return $.ajax({
    //         url: this.url + `/${habitat._id}`, 
    //         //typo in dataType doesn't change error- could that mean the dataType is the error?
    //         //Commenting it out also doesn't change the error
    //         //Commenting out contentType also doesn't change the error
    //         //crossDomain: true,
    //         dataType: 'json',
    //         //data: JSON.stringify(habitat.animals),
    //         // headers: {
    //         //     "Access-Control-Allow-Origin": "*"
    //         // },
    //         data: JSON.stringify(habitat),
    //         //contentType: 'text',
    //         contentType: 'application/json',
    //         type: 'PUT'
    //     });
    // }

    static deleteHabitat(id) {
        return $.ajax({
            url: `${this.url}/${id}`,
            type: "DELETE"
        })
    }
}

class DOMManager {
    static habitats;

    static getAllHabitats() {
        console.log("inside getAllHabitats")
        //???
        HabitatService.getAllHabitats().then(habitats => this.render(habitats));
    }

    static createHabitat(name) {
        console.log("inside DOMManager createHabitat")
        HabitatService.createHabitat(new Habitat(name))
            .then(() => {
                return HabitatService.getAllHabitats();
            })
            //why does this work? does it work?
            .then((habitats) => this.render(habitats));
    }

    static deleteHabitat(id) {
        HabitatService.deleteHabitat(id)
            .then(() => {
                return HabitatService.getAllHabitats();
            })
            //same here 
            .then((habitats) => this.render(habitats));
    }

    static addAnimal(id) {
        console.log(this.habitat + "this.habitat in static AddAnimal")
        console.log("This is the type of variable" + typeof this.habitat)
        console.log(this.habitat)
        for (let habitat of this.habitat) {
            console.log("Hooray in the for loop")
            if (habitat._id == id) {
                console.log("Hooray in the for if")
                habitat.animals.push(new Animal($(`#${habitat._id}-animal-name`).val(), $(`#${habitat._id}-animal-number`).val()));
                HabitatService.updateHabitat(habitat) 
                    .then(() => {
                        return HabitatService.getAllHabitats();
                    })
                    //habitats is undefined 
                    .then(habitats => this.render(habitats));
                    console.log(this.habitats);
                    console.log("Hooray bottom of if statement")
                }
            }
            console.log("bottom of addAnimal method")
        }

    static deleteAnimal(habitatId, animalId) {
        for (let animal of this.habitats) {
            if (habitat._id == habitatId) {
                for (let animal of habitat.animals) {
                    if (animal._id == animalId) {
                        habitat.animals.splice(habitat.animals.indexOf(animal, 1));
                        HabitatService.updateHabitat(habitat)
                            .then(() => {
                                return HabitatService.getAllHabitats();
                            })
                            //need to fix habitats if it is undefined 
                            .then(habitats => this.render(habitats));
                    }
                }
            }
        }
    }

    static render(habitats) {
        this.habitat = habitats;
        $("#app").empty();
        for(let habitat of habitats) {
            $("#app").prepend(
                `<div id="${habitat._id}" class="card text-white bg-dark mb-3">
                    <div class="card-header">
                        <h2>${habitat.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteHabitat('${habitat._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card text-white bg-dark mb-3">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${habitat._id}-animal-name" class="form-control" placeholder="Animal Name">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${habitat._id}-animal-number" class="form-control" placeholder="Number of Animals">
                                </div>
                            </div>
                            <button id="${habitat._id}-new-animal" onclick="DOMManager.addAnimal('${habitat._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div>
            </div>
            <br>`
            );
            for (let animal of habitat.animals) {
                $(`#${habitat._id}`).find(".card-body").append(
                    `<p>
                        <span id="name-${animal._id}"><strong>Name:  </strong> ${animal.name}</span>
                        <span id="number-${animal._id}"><strong>Number:  </strong> ${animal.number}</span><br>
                        <button class="btn btn-danger" onclick="DOMManager.deleteAnimal('${habitat._id}', '${animal._id}')">Delete Animal</button>`
                );
            }
        }
    }
}

//maybe here? no habitats mentioned also want to code an ability to 
$('#create-new-habitat').click(() => {
    DOMManager.createHabitat($('#new-habitat-name').val());
    $('#new-habitat-name').val('');
    console.log("new habitat name")
    console.log($('#new-habitat-name').val(''))
});



DOMManager.getAllHabitats();