const containerFilas = document.querySelector('#containerFilas');
const filterOrderName = document.querySelector('#filterOrderName');
const filterOrderPoints = document.querySelector('#filterOrderPoints');
let teamsJSON=[];

// JSON team color according league type
const colorTeam = {
    "championsLeague" : "#09a751",
    "europaLeague":"#ffc72b",
    "conferenceLeague":"#d3d3d3",
    "descenso":"#ee4036"
};
// Pure function, calculate the point obtained by a match 
const calculatePoints = (pg, pe)=>{
    return (pg*3)+pe;
}

window.onload = async()=>{
    // Load data
    await getTeams("points");
    filterOrderPoints.addEventListener("click",()=>getTeams("points"));
    filterOrderName.addEventListener("click",()=>getTeams("name"));
};

// TODO 1: Get JSON teams
const getTeams = async(orderby)=>{
    let res = await fetch("data/teams.json");
    let data = await res.json()
    teamsJSON = orderList(data.teams,orderby);
    populateTeams(teamsJSON);
};

// TODO 2: Create rows of teams table
const populateTeams = (teams)=>{
    containerFilas.innerHTML="";
    teams.forEach((team,index)=>{
        containerFilas.innerHTML+=`
            <tr>
                <td class="${getClassTeam(index+1)}">${index+1}</td>
                <td><img src="./img/${team.img}" alt=""></td>
                <td class="team">${team.name}</td>
                <td>${calculatePoints(team.matchPoints.pg,team.matchPoints.pe)}</td>
                <td>${team.matchPoints.pj}</td>
                <td>${team.matchPoints.pg}</td>
                <td>${team.matchPoints.pe}</td>
                <td>${team.matchPoints.pp}</td>
                <td>${team.matchPoints.gf}</td>
                <td>${team.matchPoints.gc}</td>
            </tr>
        `;
    });
};


// TODO 3:Develop functions to order teams depending on total puntuation  

// Axiliar funtion:  
const getColorTeam = (position) => {
    if (position>=4) return colorTeam.championsLeague;
    if (position===5 || position===6) return colorTeam.europaLeague;
    if (position>=18) return colorTeam.descenso;

    // By default
    return colorTeam.conferenceLeague;
};

// Axiliar funtion: Return the CSS class according to the team position
const getClassTeam = (position) => {
    if (position<=4) return "type-cham-leag";
    if (position===5 || position===6) return "type-europa-leag";
    if (position>=18) return "type-descenso";
    // By default
    return "num";
};

const orderList=(array,type)=>{
    let numbers=[]
    let orderTeams=[]
    array.forEach(team=>{
        let identification = (type=="points")?calculatePoints(team.matchPoints.pg,team.matchPoints.pe):team.name;
        numbers.push(identification);
    });
    numbers=(type=="points")?numbers.sort((a,b)=>b-a):numbers.sort();
    if(type=="points") numbers=[... new Set(numbers)];
    numbers.forEach(number=>{
        let obj = array.filter(team=>{
            if(type=="points"){
                return calculatePoints(team.matchPoints.pg,team.matchPoints.pe)==number;
            }else if(type=="name"){
                return team.name==number;
            }
        });
        obj.forEach(el=>{
            orderTeams.push(el)
        });
    });
    return orderTeams;
}