
  let demographicsQuestions = [
    {
      type: "radiogroup",
      name: "gender",
      isRequired: true,
      title: "What is your gender?",
      choices: ["Male", "Female", "Other", "Perfer not to say"]
    },

    {
      type: "radiogroup",
      name: "native",
      isRequired: true,
      title: "Are you a native English speaker",
      choices: ["Yes", "No"]
    },
    {
      type: "text",
      name: "native language",
      visibleIf: "{native}='No'",
      title: "Please indicate your native language or languages:"
    },

    {
      type: "text",
      name: "languages",
      title: "What other languages do you speak?"
    },

    { type: "text", name: "age", title: "What is your age?", width: "auto" },
    
    {
      type: "radiogroup",
      name: "artskill",
      isRequired: true,
      title: "How would you rate your artistic skill level?",
      choices: ["Below average", "Slightly below average", "Average", "Slightly above average", "Above average"]
    },
    

    {
      type: "radiogroup",
      name: "degree",
      isRequired: true,
      title: "What is the highest degree or level of shcool you have completed/ If currently enrolled, highest degree received.",
      choices: [
        "Less than high school",
        "High school diploma",
        "Some college, no degree",
        "associates|Associate's degree",
        "bachelors|Bachelor's degree",
        "masters|Master's degree",
        "PhD, law, or medical degree",
        "Prefer not to say"
      ]
    },
    {
      type: "text",
      name: "favorite hs subject",
      visibleIf: "{degree}='Less than high school' or {degree}='High school diploma' or {degree}='Some college, no degree'",
      title: "What was your favorite subject in high school?"
    },
    {
      type: "text",
      name: "college",
      visibleIf: "{degree}='associates' or {degree}='bachelors' or {degree}='masters' or {degree}='PhD, law, or medical degree'",
      title: "What did you study in college?"
    },
    {
      type: "text",
      name: "grad",
      visibleIf: "{degree}='masters' or {degree}='PhD, law, or medical degree'",
      title: "What did you study in graduate school?"
    }
  ];