Deck.slide({
  id: 'neural-operator',
  title: 'Neural Operators',
  html: String.raw`
<ul>
  <li>Learn the parameter-to-solution map \(\red{\theta} \mapsto u(\cdot\,,\red{\theta};\blue{W})\)</li>
  <li>DeepONet, Fourier Neural Operator, In-Context Operator, UniSolver, etc.</li>
</ul>
<div class="row" style="margin-top:20px; gap:30px; justify-content:center">
  <div style="display:grid; grid-template-columns:200px 60px 200px; gap:14px 10px; align-items:center; text-align:center">
    <div>\(\red{\theta}\)</div><div></div><div>\(u\)</div>
    <img src="images/no-theta1.png" width="200"><div>\(\rightarrow\)</div><img src="images/no-u1.png" width="200">
    <img src="images/no-theta2.png" width="200"><div>\(\rightarrow\)</div><img src="images/no-u2.png" width="200">
  </div>
  <div style="width:480px">\[-\nabla\cdot\big(\red{\theta}(x)\nabla u(x)\big) = f(x)\]</div>
</div>
<div class="cite">
  Li, Z., Kovachki, N., Azizzadenesheli, K., Liu, B., Bhattacharya, K., Stuart, A., Anandkumar, A., 2021. Fourier Neural Operator for Parametric Partial Differential Equations.<br>
  Lu, L., Jin, P., Pang, G., Zhang, Z., Karniadakis, G.E., 2021. Learning nonlinear operators via DeepONet based on the universal approximation theorem of operators.<br>
  Yang, L., Liu, S., Meng, T., Osher, S.J., 2023. In-context operator learning with data prompts for differential equation problems.<br>
  Zhou, H., Ma, Y., Wu, H., Wang, H., Long, M., 2024. Unisolver: PDE-Conditional Transformers Are Universal PDE Solvers.
</div>`,
});
