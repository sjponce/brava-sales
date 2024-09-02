const { Preference } = require("mercadopago");
const { client, createPreference, getPreference } = require("./mercadoPagoConfig");

jest.mock("mercadopago", () => ({
  MercadoPagoConfig: jest.fn(),
  Preference: jest.fn(),
}));

describe("mercadoPagoConfig", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("test_create_preference_success", async () => {
    const mockCreate = jest.fn().mockResolvedValue({ id: "pref123" });
    Preference.mockImplementation(() => ({
      create: mockCreate,
    }));

    const body = { items: [{ title: "Test Item", unit_price: 100 }] };
    const result = await createPreference(body);

    expect(Preference).toHaveBeenCalledWith(client);
    expect(mockCreate).toHaveBeenCalledWith({ body });
    expect(result).toEqual({ id: "pref123" });
  });

  test("test_get_preference_success", async () => {
    const mockGet = jest.fn().mockResolvedValue({ id: "pref123", status: "approved" });
    Preference.mockImplementation(() => ({
      get: mockGet,
    }));

    const preferenceId = "pref123";
    const requestOptions = { expand: ["items"] };
    const result = await getPreference(preferenceId, requestOptions);

    expect(Preference).toHaveBeenCalledWith(client);
    expect(mockGet).toHaveBeenCalledWith({ preferenceId, requestOptions });
    expect(result).toEqual({ id: "pref123", status: "approved" });
  });

  test("test_create_preference_failure", async () => {
    const mockCreate = jest.fn().mockRejectedValue(new Error("API Error"));
    Preference.mockImplementation(() => ({
      create: mockCreate,
    }));

    const body = { items: [{ title: "Test Item", unit_price: 100 }] };
    await expect(createPreference(body)).rejects.toThrow("API Error");
  });

  test("test_get_preference_failure", async () => {
    const mockGet = jest.fn().mockRejectedValue(new Error("Not Found"));
    Preference.mockImplementation(() => ({
      get: mockGet,
    }));

    const preferenceId = "non_existent_pref";
    await expect(getPreference(preferenceId)).rejects.toThrow("Not Found");
  });
});
