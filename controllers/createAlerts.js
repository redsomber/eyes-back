import PostModel from "../models/Post.js";
import AlertModel from "../models/Alerts.js";
import dotenv from "dotenv";

dotenv.config();

export const createAlertCheck = () => {
  let lastAlertCheckTime = 0;

  return (req, res, next) => {
    const now = Date.now();
    const elapsedTime = now - lastAlertCheckTime;
    const minTimeBetweenAlertChecks = 300 * 1000; // Time in milliseconds

    // Call alertCheck only if more than one minute has passed since the last call
    if (elapsedTime > minTimeBetweenAlertChecks) {
      increacePercent(req);
      lastAlertCheckTime = now;
    }

    next();
  };
};

const increacePercent = async (req) => {
  const dataID = process.env.TEMPDOC;

  try {
    const data = await PostModel.findById(dataID);
    let newAlerts = [];
    let alertVolume = [];

    req.body.forEach((ticker) => {
      const dataTicker = data.tickers.find((t) => t.ticker === ticker.ticker);

      const dataPercent = parseFloat(dataTicker.price.replace(",", "."));
      const requestPercent = parseFloat(ticker.price.replace(",", "."));
      const result = ((requestPercent - dataPercent) / dataPercent) * 100;

      const volumePercent = percentVolumeCalc(dataTicker, ticker);

      if (volumePercent > 300 && result.toFixed(1) != 0) {
        alertVolume.push({
          ...ticker,
          increace: result.toFixed(1),
          incVolume: volumePercent.toFixed(0),
        });
      }

      if (dataTicker && result > 3 && result != Infinity) {
        newAlerts.push({
          ...ticker,
          increace: result.toFixed(1),
          incVolume: volumePercent.toFixed(0),
        });
      }
    });

    if (newAlerts.length > 0) {
      const Alert = new AlertModel({
        alert: "> 3% in 5 min",
        tickers: newAlerts,
      });
      await Alert.save();
      console.log(newAlerts);
      newAlerts = [];
    }

    if (alertVolume.length > 0) {
      const Alert = new AlertModel({
        alert: "> 300% vol in 5 min",
        tickers: alertVolume,
      });
      await Alert.save();
      console.log(alertVolume);
      alertVolume = [];
    }

    await PostModel.updateOne(
      {
        _id: dataID,
      },
      {
        tickers: averageVolumeCalc(req.body, data),
      }
    );
  } catch (err) {
    console.log(err);
  }
};

const percentVolumeCalc = (dataTicker, ticker) => {
  let volumePercent;

  const oldVolume = parseInt(dataTicker.volume);
  const newVolume = parseInt(ticker.volume);
  const resultVol = newVolume - oldVolume;

  if (dataTicker.tempVolume > 0) {
    volumePercent =
      ((resultVol - dataTicker.tempVolume) / dataTicker.tempVolume) * 100;
  } else {
    volumePercent = resultVol;
  }

  return volumePercent;
};

const averageVolumeCalc = (arr, data) => {
  let newTickers = [];

  arr.forEach((ticker) => {
    const dataTicker = data.tickers.find((t) => t.ticker === ticker.ticker);
    let averageVol;

    const oldVolume = parseInt(dataTicker.volume);
    const newVolume = parseInt(ticker.volume);
    const resultVol = newVolume - oldVolume;

    if (resultVol > 0) {
      averageVol = (resultVol + dataTicker.tempVolume) / 2;
    } else {
      averageVol = dataTicker.tempVolume;
    }

    newTickers.push({ ...ticker, tempVolume: averageVol });
  });

  return newTickers;
};
