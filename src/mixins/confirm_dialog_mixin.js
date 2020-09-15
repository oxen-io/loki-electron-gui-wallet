export default {
  methods: {
    buildDialogFields(val) {
      const { feeList, amountList, destinations, metadataList, priority, isSweepAll, address } = val.txData;
      const totalFees = feeList.reduce((a, b) => a + b, 0) / 1e9;
      const totalAmount = amountList.reduce((a, b) => a + b, 0) / 1e9;
      // If the tx is a sweep all, we're sending to the wallet's primary address
      // a tx can be split, but only sent to one address
      let destination = isSweepAll ? address : destinations[0].address;
      const isBlink = [0, 2, 3, 4, 5].includes(priority) ? true : false;
      const confirmFields = {
        metadataList,
        isBlink,
        destination,
        totalAmount,
        totalFees
      };
      return confirmFields;
    }
  }
};
