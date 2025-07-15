// members: array of names
// bills: [{ amount, desc, payers: [names], splitters: [names] }]
// Returns: [{ from, to, amount }]
function settleUp(members, bills) {
  if (!members.length || !bills.length) return [];
  // Track how much each person owes to each other
  const obligations = {};
  for (const bill of bills) {
    const splitAmong = bill.splitters && bill.splitters.length > 0 ? bill.splitters : members;
    const payers = bill.payers && bill.payers.length > 0 ? bill.payers : [];
    if (!payers.length || !splitAmong.length) continue;
    const share = bill.amount / splitAmong.length;
    const payerShare = bill.amount / payers.length;
    // For each splitter, if not a payer, they owe their share to the payers
    for (const splitter of splitAmong) {
      if (payers.includes(splitter)) continue; // skip if splitter is also a payer
      for (const payer of payers) {
        const key = splitter + '->' + payer;
        obligations[key] = (obligations[key] || 0) + share / payers.length;
      }
    }
  }
  // Net obligations between each pair
  const netObligations = {};
  for (const key in obligations) {
    const [from, to] = key.split('->');
    const reverseKey = to + '->' + from;
    const net = (obligations[key] || 0) - (obligations[reverseKey] || 0);
    if (net > 0.01) {
      netObligations[key] = net;
    }
  }
  // Convert to settlement array
  const settlements = [];
  for (const key in netObligations) {
    const [from, to] = key.split('->');
    settlements.push({ from, to, amount: netObligations[key] });
  }
  return settlements;
}

export default settleUp; 