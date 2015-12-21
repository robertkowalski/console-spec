exports = (module.exports = Logger)

exports.maybeApplyFormatSpecifier = maybeApplyFormatSpecifier;
exports.getFormatter = getFormatter;
exports.format = format;

function notImplemented () { throw new Error('not implemented'); };

const converters = {
  '%s': function (a) { return '' + a; }, // string
  '%d': function (a) { return Number.parseInt(a); }, // integer
  '%i': function (a) { return Number.parseInt(a); }, // integer
  '%f': function (a) { return Number.parseFloat(a); }, // float

  // these require a UI
  '%o': notImplemented, // expandable DOM element
  '%O': notImplemented, // expandable JS Object
  '%c': notImplemented, // applies CSS
};
const specifier = Object.keys(converters);


const hasSpecifier = new RegExp('(' + specifier.join('|') + ')');

global.print = print;
function print(logLevel, ...args) {
  // for node writing to process.stdout works
  // browser vendors add different colors to different types
  // fall back to native console for now
  console[logLevel].apply(this, args);
}

function Logger(logLevel, ...args) {
  if (args.length === 0) {
    return;
  }

  args = maybeApplyFormatSpecifier(args);

  global.print(logLevel, args);
}

function maybeApplyFormatSpecifier(args) {
  if (args.length === 1) {
    return args;
  }

  if (!hasSpecifier.test(args[0])) {
    return args;
  }

  return format(args);
}

function format(args) {
  if (!hasSpecifier.test(args[0])) {
    return args;
  }

  if (args.length === 1) {
    return args;
  }

  const token = args[0].split('');
  let rest;
  let result;
  for (let i = 0; i < (token.length - 1); i++) {
    if (specifier.indexOf(token[i] + token[i + 1]) !== -1) {
      const formatter = getFormatter(token[i] + token[i + 1]);

      result = args[0].replace(token[i] + token[i + 1], formatter(args[1]));
      rest = args.slice(2);
      break;
    }
  }

  return format([result, ...rest]);
}

function getFormatter(specifier) {
  function passThrough (a) { return a; };

  if (!converters[specifier]) {
    return passThrough;
  }

  return converters[specifier];
}
