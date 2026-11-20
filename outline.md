# Outline — Bilevel Local Operator Learning for PDE Inverse Problems (MDS26)

One line per slide: the key idea. File names refer to `slides/`.

## Introduction
1. `title` — Bilevel Local Operator Learning for PDE Inverse Problems.
2. `outline` — SciML → existing approaches → BiLO → Bayesian BiLO.
3. `acknowledgement` — Collaborators and the two papers (BiLO in JCP, Bayesian BiLO in Nature Communications).
4. `examples` — Motivating applications: tumor infiltration (MRI), gene transcription (smFISH).
5. `why-sciml` — Data are sparse and expensive and need interpretation, so we fit mathematical models to data: a PDE inverse problem.
6. `calibrating` — PDE-constrained optimization; the key quantity is ∇θ L_data subject to the PDE constraint.
7. `uq-bayes` — Bayesian inference samples θ; gradient-based MCMC needs the same ∇θ L_data.
8. `opt-vs-bayes` — Optimization and sampling both require the PDE-constrained gradient.

## Existing approaches
9. `methods-overview` — Three families: adjoint method, neural operators, PINNs.
10. `adjoint` — (builds) Scalar cartoon: contours of L_data(u) and the constraint F(u, θ) = 0; a point slides along the constraint to where it is tangent to a contour. Then: adjoint equation, ∇θ L_data = −⟨λ, ∂θ𝓛 u⟩; accurate, but needs forward and adjoint solves at every step.
11. `neural-operator` — Learn the parameter-to-solution map θ ↦ u(·, θ).
12. `neural-operator-training` — Trained on solution pairs and fast to evaluate, but inaccurate when the true θ is out of distribution.
13. `pinn` — Represent u by a neural network; fit the data, solve the PDE, and infer parameters at once.
14. `pinn-inverse` — PINN solves an unconstrained problem L_res + w_data · L_data over (θ, W); θ follows −∇θ L_res, which does not directly depend on L_data.

## BiLO
15. `bilo-animation` — (animated) Solutions for θ = 1, 2, 1/2 → the full solution operator u(x, θ) turns the problem into min L_data(θ), shown with gradient descent → restart: a **local** operator near θ⁽ᵏ⁾ is enough to get the descent direction, and it moves with the iterates.
16. `bilo-local-loss` — Locally, r = 0 and ∇θ r = 0; train the local operator with residual + residual-gradient loss.
17. `bilo-bilevel` — PDE-constrained optimization becomes a bilevel problem: upper level fits data, lower level fits the local operator.
18. `algorithm` — The nested iterative scheme (struck through) is replaced by simultaneous gradient descent on θ (upper) and W (lower). Pre-training at θ₀ is in the notes.
19. `theory` — If L_LO < ε, the approximate gradient differs from the true hyper-gradient by O(ε).
20. `demo` — Live demo: Physics-Informed Machine Learning Playground.

## GBM example
21. `gbm-intro` — GBM in FLAIR, T1Gd, FET-PET: each modality shows a different aspect of the tumor.
22. `gbm-treatment` — The uniform 2 cm treatment margin misses infiltration, which is anisotropic and patient specific.
23. `gbm-model` — Reaction–diffusion model of tumor cell density gives the spatial distribution needed for targeting.
24. `gbm-forward` — Forward model: (D, ρ) → predicted u → threshold → predicted segmentation, compared with the data segmentation.
25. `gbm-inverse` — Infer the PDE parameters and imaging thresholds so the predicted segmentations match the data.
26. `gbm-pipeline` — Full pipeline: images → model → physics-informed network → prediction validated against recurrence.
27. `gbm-results-pinn` — PINN: the neural network solution and the numerical solution with the inferred parameter disagree.
28. `gbm-results-bilo` — BiLO: the two agree (stronger PDE constraint).
29. `bilo-summary` — Bilevel formulation, stronger PDE constraint, robust to noise, efficient simultaneous descent.
30. `bilo-connections` — BiLO connects PINN (bilevel formulation), adjoint (autograd sensitivity), and neural operators (local, physics-only).

## Bayesian BiLO
31. `bbilo-uq` — Sampling θ from the potential energy needs ∇θ L_data.
32. `bbilo-lora` — (animated) At θ₁: train the local operator, get ∇θU, HMC step to θ₂; the local operator at θ₂ is a low-rank (LoRA) update of the one at θ₁.
33. `gbm-uq` — GBM: MAP estimate (segmentation margins) and parameter distributions (LoRA matches full fine-tuning).
34. `gbm-uq-fields` — GBM: posterior mean and posterior STD of u.

## Unknown functions
35. `unknown-function` — Treat z = f(x) as an extra input; a local operator in z gives gradients with respect to the function.
36. `unknown-function-nn` — Parametrizing f by a network makes the operator depend on a high-dimensional V.
37. `darcy` — Darcy flow: infer the coefficient field A from u.
38. `darcy-result` — (builds) Initial guess → data u → BiLO inference → ground-truth A. BiLO recovers A (1.3% error in u, 98% classification accuracy of the thresholded coefficient).
39. `sampling-function` — Sampling a function: B-BiLO posterior for D(x) from a 64-term KL expansion.
40. `bbilo-summary` — Avoid sampling high-dimensional weights; stronger PDE constraint; efficient sampling with LoRA.

## Ongoing work
- `identifiability` — smFISH snapshots: identifiability of 𝓛u − γu + B = 0 depends on the source B (smooth vs point), the boundary condition, and the stochastic convention (Itô / Stratonovich / isothermal).

## Closing
41. `thanks` — Thank you.
42. `papers-qr` — QR codes linking to the BiLO (JCP) and Bayesian BiLO (Nature Communications) papers.
