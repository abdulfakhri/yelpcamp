module.exports = func =>
{
    return (req, res, next) =>
    {
        func(req, res, next).catch(next);
    }
}

//Used to wrap Async functions, not needed in Express v5 but needed on non async funcs
//We are not using this in the main app, this is reference only for what was needed in ExpressJS v4