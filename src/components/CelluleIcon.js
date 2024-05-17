import React from 'react';
import './SectionIngredienti.css';

const paths = [
  "M260.51761,233.66881c1.27734.31858,2.0136.48981,3.12585.5908.64503.32192,2.00804.12056,2.64955.44339,4.15676,1.05305,5.23752,1.8844,8.69935,2.55254,7.69945,3.7324,16.08742,5.76342,23.60706,10.01655,16.21592,9.1719,28.30819,21.12897,32.89209,40.21771,6.95473,28.96151-16.65977,46.50754-39.55025,47.9311-15.5396.96637-29.98869-3.71311-44.02798-8.77351-24.71407-8.90793-48.24148-7.84376-71.50179,4.03551-6.4299,3.2838-12.62084,1.92945-18.56033-1.55569-15.20001-14.18691-16.45744-30.59009-3.20703-50.34824,19.98108-29.79413,48.54043-44.40802,83.95398-46.33016,4.66155-.25304,9.35047-.00181,14.0308.01499,2.54208.29568,3.80898.80393,5.51071.83925.80254.01666,1.59914.17153,2.378.36579Z",
  "M489.76941,629.47136c47.25132.13451,87.55822,32.75081,100.61299,80.32744,4.82867,17.59715,7.33076,35.23564.29304,52.82744-5.14556,12.86158-13.69465,22.97818-27.02109,27.4894-16.87878,5.71345-30.50799-1.45435-42.10024-13.18894-10.17855-10.30343-14.34693-23.97935-19.16625-37.1553-3.30089-9.02512-6.15364-18.18762-10.05741-27.01722-6.54055-14.79384-18.33368-24.42127-31.59621-32.2476-9.61174-5.67211-16.16832-11.9764-13.80492-24.17038,2.29605-11.8459,9.24258-19.58708,20.32124-23.60072,7.64021-2.76789,15.65225-3.76008,22.51885-3.26413Z",
  "M439.37688,169.74021c5.35007-10.04992,9.01345-20.94601,16.3528-29.99862,21.27362-26.24049,49.30527-25.5811,69.07878,1.87155,10.71808,18.91255,8.97243,38.58683,2.73637,58.13649-11.39955,35.73546-33.45442,62.03495-69.7572,74.19642-21.47718,7.19491-43.30197,8.69533-64.27367-2.38201-11.61418-6.1346-17.28438-21.20024-13.20215-33.61861,1.83512-5.58275,6.73686-7.83388,11.36807-9.94352,25.50028-11.61616,39.88889-32.20913,47.69699-58.26169Z",
  // Add other paths as needed
];

const CelluleIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840.95162 803.20313">
      {paths.map((d, index) => (
        <path key={index} d={d} className="ant-path" />
      ))}
    </svg>
  );
};

export default CelluleIcon;
