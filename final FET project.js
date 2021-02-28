class Habitat {
    constructor(habitat) {
        this.habitat = habitat;
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
        console.log("habitat create" + habitat);
        return $.ajax({
            url: this.url, 
            dataType: 'json',
            data: JSON.stringify(habitat),
            contentType: 'application/json',
            type: "POST"
        });
    }
    
    
    static updateHabitat(habitat) {
        console.log("habitat update" + habitat);
        return $.ajax({
            url: this.url+ `/${habitat._id}`,
            dataType: 'json',
            data: JSON.stringify({
                "habitat" : habitat.habitat,
                "animals" : habitat.animals}),
            contentType: 'application/json',
            type: 'PUT'
        });
    };



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
        HabitatService.getAllHabitats().then(habitats => this.render(habitats));
    }

    static createHabitat(name) {
        console.log("inside DOMManager createHabitat")
        HabitatService.createHabitat(new Habitat(name))
            .then(() => {
                return HabitatService.getAllHabitats();
            })
            .then((habitats) => this.render(habitats));
    }

    static deleteHabitat(id) {
        HabitatService.deleteHabitat(id)
            .then(() => {
                return HabitatService.getAllHabitats();
            })
            .then((habitats) => this.render(habitats));
    }

    static addAnimal(id) {
        console.log(this.habitat + "this.habitat in static AddAnimal")
        console.log("This is the type of variable" + typeof this.habitat)
        console.log(this.habitat)
        //OG this.habints
        for (let habitat of this.habitats) {
            console.log("Hooray in the for loop")
            if (habitat._id == id) {
                console.log("Hooray in the for if")
                habitat.animals.push(new Animal($(`#${habitat._id}-animal-name`).val(), $(`#${habitat._id}-animal-number`).val()));
                HabitatService.updateHabitat(habitat) 
                    .then(() => {
                        return HabitatService.getAllHabitats();
                    })
                    .then(habitats => this.render(habitats));
                    console.log(this.habitats);
                    console.log("Hooray bottom of if statement")
                }
            }
            console.log("bottom of addAnimal method")
        }

        static deleteAnimal(habitatId, animalName) {
            for (let habitat of this.habitats) {
                if (habitat._id == habitatId) {
                    //to ensure that it will not give a value back 
                        habitat.animals = habitat.animals.filter(function(e) {
                            //returning correct animal name and confirming that it is not another
                            return e.name != animalName;
                        });
                        HabitatService.updateHabitat(habitat)
                            .then(() => {
                                return HabitatService.getAllHabitats();
                            })
                            .then(habitats => this.render(habitats));
//                     }
//                 }
            }
        }
    }

    static render(habitats) {
        this.habitats = habitats;
        $("#app").empty();
        for(let habitat of habitats) {
            $("#app").prepend(
                `<div id="${habitat._id}" class="card text-white bg-dark mb-3">
                    <div class="card-header">
                        <h2>${habitat.habitat}</h2>
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
                        <span id="name-${animal.name}"><strong>Name:  </strong> ${animal.name}</span>
                        <span id="number-${animal.number}"><strong>Number:  </strong> ${animal.number}</span><br>
                        <button class="btn btn-danger" onclick="DOMManager.deleteAnimal('${habitat._id}', '${animal.name}')">Delete Animal</button>`
                );
            }
        }
    }
}


$('#create-new-habitat').click(() => {
    DOMManager.createHabitat($('#new-habitat-name').val());
    $('#new-habitat-name').val('');
    console.log("new habitat name")
    console.log($('#new-habitat-name').val(''))
});



DOMManager.getAllHabitats();