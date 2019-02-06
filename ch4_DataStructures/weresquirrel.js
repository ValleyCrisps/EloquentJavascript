// import journal data
require('./journal.js');

function getJournalEvents(){
  // returns a list of all events form the journal
  let eventsList = [];
  // iterate on each day
  for (let entry of JOURNAL) {
    // iterate through the day's events. If the event is already in the list, skip
    // to the next, otherwise add it to the list
    for (let event of entry.events) {
      if (!eventsList.includes(event)) eventsList.push(event);
    }
  }
  return eventsList;
}


function correlationTable(event) {
  // returns the correlation table between a given event and squirrelification
  /* corr[00, 01, 10, 11]:
  corr[0] = corr[00] = !squirrel && !event
  corr[1] = corr[01] = !squirrel && event
  corr[2] = corr[10] = squirrel && !event
  corr[3] = corr[11] = squirrel && event
  */
  let corr = [0, 0, 0, 0];
  let i = 0;
  for (let entry of JOURNAL) {
    if (entry.squirrel === true) i += 2;
    if (entry.events.includes(event)) i++;
    corr[i]++;
    i = 0;
  }
  return corr;
}


function phi([n00, n01, n10, n11]) {
  // given a correlation array, returns the phi correlation value
  /* (1: perfect direct correlation, -1: perfect inverse correlation,
  0: not correlated)
  */
  return (n00*n11 - n01*n10) / Math.sqrt(
    (n00+n01)*(n10+n11)*(n00+n10)*(n01+n11));
}


// get the complete list of events in the journal
journalEvents = getJournalEvents();

// compute and print the phi correlation of each event and squirrelification
for (let event of journalEvents) {
  console.log(`${event} : ${phi(correlationTable(event))}`);
}

console.log("\n Relevant events:");
for (let event of journalEvents) {
  if (Math.abs(phi(correlationTable(event))) > 0.1) {
    console.log(`${event} : ${phi(correlationTable(event))}`);
  }
}

// add a new event "peanut teeth" for peanuts and unbrushed teeth
for (let entry of JOURNAL){
  if (entry.events.includes("peanuts") &&
   !entry.events.includes("brushed teeth")){
      entry.events.push("peanut teeth");
   }
}
console.log("\n Peanuts and unbrushed teeth:");
console.log(`${phi(correlationTable("peanut teeth"))}`);

//console.log(correlationTable("pizza"));
