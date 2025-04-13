const typerMarkup = `import Typewriter from 'typewriter-effect';

<Typewriter
  options={{
    loop: true,
    autoStart: true,
    strings: ['easy usage', 'fast transactions', 'secure payments']
  }}
/>
`;

const replaceMeMarkup = `import ReplaceMe from "components/ReplaceMe";

<ReplaceMe class="rotator-fade text-primary">
  easy usage,fast transactions,secure payments
</ReplaceMe>

<ReplaceMe class="rotator-zoom text-primary">
  easy usage,fast transactions,secure payments
</ReplaceMe>
`;

export { typerMarkup, replaceMeMarkup };
